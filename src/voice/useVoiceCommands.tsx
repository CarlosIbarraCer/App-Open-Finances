import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import { AccessibilityInfo, AppState, AppStateStatus } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import {
  getIntentConfirmation,
  matchIntent,
  SupportedLocale,
  VoiceIntentId,
  VoiceIntentMatch,
} from './intents';
import {
  createTelemetryBucket,
  ensureMicrophonePermission,
  normalizeTranscript,
  resolveLocale,
  VoiceTelemetryBucket,
} from './index';
import {
  initialVoiceState,
  voiceStateReducer,
  VoiceCommandState,
} from './state';

const VoiceModule: typeof import('@react-native-voice/voice') | null = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
    const module = require('@react-native-voice/voice');
    return module?.default ?? module;
  } catch (error) {
    return null;
  }
})();

export type VoiceIntentHandler = (match: VoiceIntentMatch) => Promise<void> | void;

type UseVoiceCommandsOptions = {
  enabled: boolean;
  handlers: Partial<Record<VoiceIntentId, VoiceIntentHandler>>;
  locale?: string;
  telemetryEnabled?: boolean;
  onIntentExecuted?: (payload: { match: VoiceIntentMatch; ok: boolean }) => void;
};

const STOP_ANNOUNCEMENT = {
  'en-US': 'Listening stopped.',
  'es-MX': 'Escucha detenida.',
  'es-ES': 'Escucha detenida.',
};
const voice = VoiceModule;
const voiceAvailable = Boolean(voice);

export const useVoiceCommands = ({
  enabled,
  handlers,
  locale,
  telemetryEnabled = true,
  onIntentExecuted,
}: UseVoiceCommandsOptions) => {
  const [state, setState] = useState<VoiceCommandState>(initialVoiceState);
  const [error, setError] = useState<string | null>(null);
  const [currentIntent, setCurrentIntent] = useState<VoiceIntentMatch | null>(null);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [hasAudioFocus, setHasAudioFocus] = useState(false);

  const localeRef = useRef<SupportedLocale>(resolveLocale(locale));
  const telemetryRef = useRef<VoiceTelemetryBucket>(createTelemetryBucket());
  const screenReaderSpeakingRef = useRef(false);
  const releaseSpeakTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingStopRef = useRef(false);

  useEffect(() => {
    localeRef.current = resolveLocale(locale);
  }, [locale]);

  const clearAnnouncementFlag = useCallback(() => {
    screenReaderSpeakingRef.current = false;
    if (releaseSpeakTimeout.current) {
      clearTimeout(releaseSpeakTimeout.current);
      releaseSpeakTimeout.current = null;
    }
  }, []);

  const announce = useCallback(
    (message: string) => {
      if (!message) {
        return;
      }
      screenReaderSpeakingRef.current = true;
      releaseSpeakTimeout.current = setTimeout(() => {
        clearAnnouncementFlag();
      }, 1600);
      AccessibilityInfo.announceForAccessibility(message);
    },
    [clearAnnouncementFlag]
  );

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
    const srListener = AccessibilityInfo.addEventListener('screenReaderChanged', (isEnabled) => {
      setScreenReaderEnabled(isEnabled);
    });
    const announcer = AccessibilityInfo.addEventListener('announcementFinished', () => {
      clearAnnouncementFlag();
    });
    return () => {
      srListener.remove();
      announcer.remove();
    };
  }, [clearAnnouncementFlag]);

  const configureAudioFocus = useCallback(async () => {
    if (hasAudioFocus) {
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    });
    setHasAudioFocus(true);
  }, [hasAudioFocus]);

  const releaseAudioFocus = useCallback(async () => {
    if (!hasAudioFocus) {
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    });
    setHasAudioFocus(false);
  }, [hasAudioFocus]);

  const resetState = useCallback(() => {
    setState((prev) => voiceStateReducer(prev, { type: 'stop' }));
    setCurrentIntent(null);
  }, []);

  const stopListening = useCallback(
    async (announceStop = true) => {
      if (!state.listening && !pendingStopRef.current) {
        return;
      }
      const wasListening = state.listening;
      pendingStopRef.current = true;
      try {
        if (voice) {
          await voice.stop();
          await voice.cancel();
        }
      } catch {
        // Swallow errors thrown when stop is called without an active session.
      } finally {
        pendingStopRef.current = false;
        const shouldAnnounce = announceStop && wasListening;
        resetState();
        await releaseAudioFocus();
        if (shouldAnnounce) {
          announce(STOP_ANNOUNCEMENT[localeRef.current] ?? STOP_ANNOUNCEMENT['es-MX']);
        }
      }
    },
    [announce, releaseAudioFocus, resetState, state.listening]
  );

  const handleSpeechResults = useCallback(
    async (event: SpeechResultsEvent) => {
      const rawValue = event.value?.[0];
      if (!rawValue) {
        return;
      }
      const normalized = normalizeTranscript(rawValue);
      setState((prev) => voiceStateReducer(prev, { type: 'processing', transcript: normalized }));
      const intent = matchIntent(normalized, localeRef.current);
      if (!intent) {
        setError(
          localeRef.current === 'en-US'
            ? 'Command not recognized.'
            : 'No entendí ese comando.'
        );
        announce(
          localeRef.current === 'en-US'
            ? 'I could not match that command.'
            : 'No encontré un comando para esa frase.'
        );
        await stopListening(false);
        return;
      }
      setCurrentIntent(intent);
      const handler = handlers[intent.id];
      let ok = false;
      try {
        if (handler) {
          await handler(intent);
          ok = true;
        } else {
          setError('No hay acción configurada para este comando.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No pude completar el comando.');
      } finally {
        await stopListening(false);
      }

      if (telemetryEnabled) {
        telemetryRef.current[intent.id][ok ? 'success' : 'failure'] += 1;
      }
      if (ok) {
        const confirmation = getIntentConfirmation(intent.id, intent.locale);
        if (confirmation) {
          announce(confirmation);
        }
      } else {
        announce(
          localeRef.current === 'en-US'
            ? 'There was a problem running that command.'
            : 'No pude ejecutar ese comando.'
        );
      }
      onIntentExecuted?.({ match: intent, ok });
    },
    [announce, handlers, onIntentExecuted, stopListening, telemetryEnabled]
  );

  const handleSpeechError = useCallback(
    async (event: SpeechErrorEvent) => {
      const friendly =
        event.error?.message ??
        (localeRef.current === 'en-US'
          ? 'Voice input failed.'
          : 'La entrada de voz falló.');
      setError(friendly);
      setState((prev) => voiceStateReducer(prev, { type: 'error' }));
      announce(
        localeRef.current === 'en-US'
          ? 'Voice input error.'
          : 'Ocurrió un error al escuchar.'
      );
      await stopListening(false);
    },
    [announce, stopListening]
  );

  const startListening = useCallback(
    async (languageTag?: string) => {
    if (!enabled) {
      setError(
        localeRef.current === 'en-US'
          ? 'Voice commands are disabled.'
          : 'Los comandos de voz están desactivados.'
      );
      return false;
    }
    if (!voiceAvailable) {
      setError(
        localeRef.current === 'en-US'
          ? 'Voice commands are unavailable.'
          : 'Los comandos de voz no están disponibles en este dispositivo.'
      );
      return false;
    }
    if (state.listening || pendingStopRef.current) {
      return false;
    }
      if (screenReaderEnabled && screenReaderSpeakingRef.current) {
        announce(
          localeRef.current === 'en-US'
            ? 'Wait until the screen reader finishes speaking.'
            : 'Espera a que TalkBack o VoiceOver terminen de hablar.'
        );
        return false;
      }
      const granted = await ensureMicrophonePermission();
      if (!granted) {
        setError(
          localeRef.current === 'en-US'
            ? 'Microphone permission is required.'
            : 'Necesitas otorgar permiso al micrófono.'
        );
        return false;
      }
      localeRef.current = resolveLocale(languageTag ?? localeRef.current);
      setError(null);
      try {
        await configureAudioFocus();
        await voice!.start(localeRef.current);
        setState((prev) => voiceStateReducer(prev, { type: 'start' }));
        announce(
          localeRef.current === 'en-US'
            ? 'Listening. Hold the button and speak.'
            : 'Escuchando. Mantén presionado y habla.'
        );
        return true;
      } catch (err) {
        await releaseAudioFocus();
        setError(err instanceof Error ? err.message : 'No se pudo iniciar la escucha.');
        setState((prev) => voiceStateReducer(prev, { type: 'error' }));
        announce(
          localeRef.current === 'en-US'
            ? 'Unable to start listening.'
            : 'No pude empezar a escuchar.'
        );
        return false;
      }
    },
    [
      announce,
      configureAudioFocus,
      enabled,
      releaseAudioFocus,
      screenReaderEnabled,
      state.listening,
    ]
  );

  useEffect(() => {
    if (!voice) {
      return;
    }
    voice.onSpeechResults = handleSpeechResults;
    voice.onSpeechError = handleSpeechError;
    voice.onSpeechEnd = () => {
      setState((prev) => voiceStateReducer(prev, { type: 'stop' }));
      releaseAudioFocus();
    };

    return () => {
      voice.destroy().finally(() => voice.removeAllListeners());
    };
  }, [handleSpeechError, handleSpeechResults, releaseAudioFocus]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active') {
        stopListening(false);
      }
    });
    return () => subscription.remove();
  }, [stopListening]);

  useEffect(() => {
    if (!enabled && state.listening) {
      stopListening(false);
    }
  }, [enabled, state.listening, stopListening]);

  return useMemo(
    () => ({
      listening: state.listening,
      status: state.status,
      transcript: state.transcript,
      startListening,
      stopListening,
      error,
      currentIntent,
      locale: localeRef.current,
      telemetry: telemetryRef.current,
      screenReaderEnabled,
    }),
    [
      currentIntent,
      error,
      screenReaderEnabled,
      startListening,
      state.listening,
      state.status,
      state.transcript,
      stopListening,
    ]
  );
};

export type { VoiceCommandState, VoiceStateEvent } from './state';
