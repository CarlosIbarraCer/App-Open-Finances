export type SupportedLocale = 'es-MX' | 'es-ES' | 'en-US';

export type VoiceIntentId =
  | 'openCart'
  | 'searchFlight'
  | 'goBack'
  | 'createOrder'
  | 'openSettings';

export type VoiceIntentMatch = {
  id: VoiceIntentId;
  locale: SupportedLocale;
  slots: Record<string, string>;
  transcript: string;
};

type IntentMatcher = {
  locale: SupportedLocale;
  pattern: RegExp;
  slotNames?: string[];
};

type VoiceIntentDefinition = {
  id: VoiceIntentId;
  matchers: IntentMatcher[];
  confirmations: Partial<Record<SupportedLocale, string>>;
  description: Partial<Record<SupportedLocale, string>>;
};

const buildMatcher = (
  locale: SupportedLocale,
  pattern: string,
  slotNames?: string[]
): IntentMatcher => ({
  locale,
  pattern: new RegExp(`^${pattern}$`, 'i'),
  slotNames,
});

export const VOICE_INTENTS: VoiceIntentDefinition[] = [
  {
    id: 'openCart',
    matchers: [
      buildMatcher('es-MX', '(abri[ru]|ir a|mostrar) (el )?(carrito|cesta)'),
      buildMatcher('es-ES', '(abri[ru]|ir a|mostrar) (el )?(carrito|cesta)'),
      buildMatcher('en-US', '(open|show|go to) (the )?(cart|basket)'),
    ],
    confirmations: {
      'es-MX': 'Abriendo carrito.',
      'es-ES': 'Abriendo el carrito.',
      'en-US': 'Opening cart.',
    },
    description: {
      'es-MX': 'Abrir sección de carrito.',
      'es-ES': 'Abrir la sección del carrito.',
      'en-US': 'Opens the cart section.',
    },
  },
  {
    id: 'searchFlight',
    matchers: [
      buildMatcher('es-MX', '(?:buscar|seguimiento de) vuelo (\\d+)', ['flightNumber']),
      buildMatcher('es-ES', '(?:buscar|seguimiento de) vuelo (\\d+)', ['flightNumber']),
      buildMatcher('en-US', '(?:search|track) flight (\\d+)', ['flightNumber']),
    ],
    confirmations: {
      'es-MX': 'Buscando vuelo solicitado.',
      'es-ES': 'Buscando el vuelo indicado.',
      'en-US': 'Searching for the flight.',
    },
    description: {
      'es-MX': 'Buscar vuelo por número.',
      'es-ES': 'Busca un vuelo mediante número.',
      'en-US': 'Search a flight by number.',
    },
  },
  {
    id: 'goBack',
    matchers: [
      buildMatcher('es-MX', '(volver|regresar|atr[aá]s)( ahora)?'),
      buildMatcher('es-ES', '(volver|atr[aá]s)( ahora)?'),
      buildMatcher('en-US', '(go back|back|return)( now)?'),
    ],
    confirmations: {
      'es-MX': 'Regresando a la pantalla anterior.',
      'es-ES': 'Volviendo a la pantalla anterior.',
      'en-US': 'Going back.',
    },
    description: {
      'es-MX': 'Navega a la pantalla previa.',
      'es-ES': 'Navega a la vista anterior.',
      'en-US': 'Navigates back.',
    },
  },
  {
    id: 'createOrder',
    matchers: [
      buildMatcher('es-MX', '(crear|generar) pedido'),
      buildMatcher('es-ES', '(crear|generar) pedido'),
      buildMatcher('en-US', '(create|make|start) order'),
    ],
    confirmations: {
      'es-MX': 'Creando tu pedido.',
      'es-ES': 'Creando pedido.',
      'en-US': 'Creating order.',
    },
    description: {
      'es-MX': 'Inicia flujo para crear un pedido.',
      'es-ES': 'Abre flujo para crear pedido.',
      'en-US': 'Starts the order creation flow.',
    },
  },
  {
    id: 'openSettings',
    matchers: [
      buildMatcher('es-MX', '(abrir|ir a) (ajustes|configuraci[oó]n|config)'),
      buildMatcher('es-ES', '(abrir|ir a) (ajustes|configuraci[oó]n|configuraci[oó]nes)'),
      buildMatcher('en-US', '(open|go to) (settings|configuration|preferences)'),
    ],
    confirmations: {
      'es-MX': 'Abriendo ajustes.',
      'es-ES': 'Abriendo configuración.',
      'en-US': 'Opening settings.',
    },
    description: {
      'es-MX': 'Navega a ajustes de la app.',
      'es-ES': 'Abre la pantalla de configuración.',
      'en-US': 'Opens the settings screen.',
    },
  },
];

const localeFallbacks: Record<SupportedLocale, SupportedLocale[]> = {
  'es-MX': ['es-MX', 'es-ES', 'en-US'],
  'es-ES': ['es-ES', 'es-MX', 'en-US'],
  'en-US': ['en-US', 'es-MX', 'es-ES'],
};

export const matchIntent = (
  transcript: string,
  locale: SupportedLocale
): VoiceIntentMatch | null => {
  const normalized = transcript.trim();
  if (!normalized) {
    return null;
  }
  const localePriority = localeFallbacks[locale] ?? [locale];
  for (const localeCandidate of localePriority) {
    for (const intent of VOICE_INTENTS) {
      for (const matcher of intent.matchers) {
        if (matcher.locale !== localeCandidate) {
          continue;
        }
        const matches = normalized.match(matcher.pattern);
        if (matches) {
          const slots: Record<string, string> = {};
          if (matcher.slotNames) {
            matcher.slotNames.forEach((slot, idx) => {
              const value = matches[idx + 1];
              if (slot && value) {
                slots[slot] = value;
              }
            });
          }
          return {
            id: intent.id,
            locale: localeCandidate,
            slots,
            transcript: normalized,
          };
        }
      }
    }
  }
  return null;
};

export const getIntentConfirmation = (intentId: VoiceIntentId, locale: SupportedLocale) => {
  const intent = VOICE_INTENTS.find((definition) => definition.id === intentId);
  if (!intent) {
    return '';
  }
  return (
    intent.confirmations[locale] ??
    intent.confirmations['es-MX'] ??
    intent.confirmations['en-US'] ??
    ''
  );
};

export const describeIntent = (intentId: VoiceIntentId, locale: SupportedLocale) => {
  const intent = VOICE_INTENTS.find((definition) => definition.id === intentId);
  if (!intent) {
    return '';
  }
  return (
    intent.description[locale] ??
    intent.description['es-MX'] ??
    intent.description['en-US'] ??
    ''
  );
};
