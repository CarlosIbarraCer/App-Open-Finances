import { getLocales } from 'expo-localization';
import { SupportedLocale, VoiceIntentId } from './intents';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['es-MX', 'es-ES', 'en-US'];
export const DEFAULT_LOCALE: SupportedLocale = 'es-MX';

export const normalizeTranscript = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,;:!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const FALLBACK_MAP: Record<string, SupportedLocale> = {
  es: 'es-MX',
  'es-mx': 'es-MX',
  'es-es': 'es-ES',
  en: 'en-US',
  'en-us': 'en-US',
};

export const resolveLocale = (languageTag?: string): SupportedLocale => {
  if (languageTag) {
    const normalized = languageTag.toLowerCase();
    const direct = FALLBACK_MAP[normalized];
    if (direct) {
      return direct;
    }
    const base = normalized.slice(0, 2);
    if (FALLBACK_MAP[base]) {
      return FALLBACK_MAP[base];
    }
  }
  const [primary] = getLocales();
  if (primary) {
    const normalized = primary.languageTag?.toLowerCase();
    if (normalized && FALLBACK_MAP[normalized]) {
      return FALLBACK_MAP[normalized];
    }
    const baseTag = primary.languageCode?.toLowerCase();
    if (baseTag && FALLBACK_MAP[baseTag]) {
      return FALLBACK_MAP[baseTag];
    }
    if (primary.regionCode?.toLowerCase() === 'mx' && baseTag === 'es') {
      return 'es-MX';
    }
  }
  return DEFAULT_LOCALE;
};

export const ensureMicrophonePermission = async () => true;

export type VoiceTelemetryBucket = Record<
  VoiceIntentId,
  {
    success: number;
    failure: number;
  }
>;

export const createTelemetryBucket = (): VoiceTelemetryBucket => ({
  openCart: { success: 0, failure: 0 },
  searchFlight: { success: 0, failure: 0 },
  goBack: { success: 0, failure: 0 },
  createOrder: { success: 0, failure: 0 },
  openSettings: { success: 0, failure: 0 },
});
