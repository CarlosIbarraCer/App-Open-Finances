import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SupportedLocale } from '../voice/intents';

type VoiceButtonProps = {
  enabled: boolean;
  listening: boolean;
  status: 'idle' | 'listening' | 'processing' | 'error';
  onStart: () => void;
  onStop: () => void;
  error?: string | null;
  transcript?: string;
  locale: SupportedLocale;
  variant?: 'overlay' | 'inline';
};

const HIT_SLOP = { top: 16, bottom: 16, left: 16, right: 16 };

const instructions: Record<SupportedLocale, string> = {
  'es-MX': 'Mantén presionado para comandos de voz.',
  'es-ES': 'Mantén pulsado para comandos de voz.',
  'en-US': 'Hold to issue a voice command.',
};

const recordingIndicatorLabel: Record<SupportedLocale, string> = {
  'es-MX': 'Grabando audio',
  'es-ES': 'Grabando audio',
  'en-US': 'Recording audio',
};

export function VoiceButton({
  enabled,
  listening,
  status,
  onStart,
  onStop,
  error,
  transcript,
  locale,
  variant = 'overlay',
}: VoiceButtonProps) {
  const disabled = !enabled;
  const label =
    locale === 'en-US'
      ? 'Push-to-talk voice commands'
      : 'Botón para comandos de voz';
  const hint =
    locale === 'en-US'
      ? 'Hold while you speak. Double tap to toggle listening.'
      : 'Mantén presionado y habla. Doble toque para alternar escucha.';
  const pointerActiveRef = React.useRef(false);

  const handlePress = () => {
    if (disabled) {
      return;
    }
    if (listening) {
      onStop();
    } else {
      onStart();
    }
  };

  const isOverlay = variant === 'overlay';
  const containerClass = isOverlay ? 'absolute bottom-8 left-0 right-0 px-5' : 'w-full';
  const helperTextClass = isOverlay
    ? 'mt-2 text-center text-[11px] text-gray-500'
    : 'mt-2 text-[11px] text-gray-500';

  return (
    <View
      className={containerClass}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={isOverlay ? { zIndex: 50 } : undefined}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ disabled, busy: listening }}
        className={`flex-row items-center justify-between rounded-3xl border px-6 py-4 ${
          disabled ? 'border-gray-300 bg-gray-100 opacity-80' : 'border-indigo-200 bg-white'
        }`}
        disabled={disabled}
        hitSlop={HIT_SLOP}
        onPressIn={() => {
          pointerActiveRef.current = true;
          if (!disabled && !listening) {
            onStart();
          }
        }}
        onPressOut={() => {
          pointerActiveRef.current = false;
          if (!disabled && listening) {
            onStop();
          }
        }}
        onPress={() => {
          if (pointerActiveRef.current) {
            return;
          }
          handlePress();
        }}
        style={
          isOverlay
            ? {
                shadowColor: '#818CF8',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
                elevation: 8,
              }
            : undefined
        }>
        <View className="flex-row items-center gap-3">
          <View
            className={`h-12 w-12 items-center justify-center rounded-full ${
              listening ? 'bg-rose-500' : 'bg-indigo-600'
            }`}>
            <Ionicons name="mic" size={22} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">
              {listening
                ? locale === 'en-US'
                  ? 'Listening...'
                  : 'Escuchando...'
                : locale === 'en-US'
                  ? 'Voice commands'
                  : 'Comandos de voz'}
            </Text>
            <Text className="text-xs text-gray-600">
              {instructions[locale] ?? instructions['es-MX']}
            </Text>
          </View>
        </View>
        <View className="items-end">
          {listening ? (
            <View className="flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-rose-500" />
              <Text className="text-xs font-semibold text-rose-600">
                {recordingIndicatorLabel[locale]}
              </Text>
            </View>
          ) : (
            <Text className="text-xs text-gray-400">
              {status === 'processing'
                ? locale === 'en-US'
                  ? 'Processing'
                  : 'Procesando'
                : locale === 'en-US'
                  ? 'Idle'
                  : 'Listo'}
            </Text>
          )}
          {transcript ? (
            <Text className="mt-1 max-w-[150px] text-right text-[11px] text-gray-500">
              “{transcript}”
            </Text>
          ) : null}
        </View>
      </Pressable>
      {error ? (
        <Text className="mt-2 text-center text-xs text-rose-600">
          {error}
        </Text>
      ) : (
        <Text className={helperTextClass}>
          {locale === 'en-US'
            ? 'Audio is only captured while the button is pressed.'
            : 'El audio solo se captura mientras el botón está presionado.'}
        </Text>
      )}
    </View>
  );
}

export default VoiceButton;
