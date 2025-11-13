# Voice Command Layer

This branch adds an optional push-to-talk experience on top of the existing accessible UI so TalkBack/VoiceOver users keep full control while gaining faster shortcuts.

## Stack & Configuration

- **ASR**: [`@react-native-voice/voice`](https://github.com/react-native-voice/voice). It runs on-device, keeps the session short, and supports the locales we need.
- **Expo managed workflow**: install dependencies and then run `npx expo prebuild` (or build with EAS/dev-client) so the native modules (`@react-native-voice/voice`, `@react-native-async-storage/async-storage`, `expo-av`, `expo-localization`) are compiled.
- **Permissions**:
  - Android: `RECORD_AUDIO` is declared in `app.json`. At runtime we display a rationale before requesting it via `PermissionsAndroid`.
  - iOS: `NSMicrophoneUsageDescription` added to `Info.plist` (through `app.json`).

## User Experience

- Voice commands live behind a toggle in **Settings → Preferencias → Comandos de voz**. The selection is persisted with `AsyncStorage`.
- The **VoiceButton** is a floating push-to-talk button that:
  - Only captures audio while you press it.
  - Announces start/stop so TalkBack/VoiceOver users never lose context.
  - Shows a red indicator while recording as a privacy cue.
- When a command is executed we still fire the matching UI action (navigation, order flow, etc.) so there is always a traditional fallback.
- Screen-reader compatibility: the hook pauses when TalkBack/VoiceOver is speaking, requests transient audio focus (ducking TTS instead of stopping it), and uses Accessibility announcements for confirmations.

## Supported Locales & Intents

| Intent | es-MX / es-ES phrases | en-US phrases | Action |
| --- | --- | --- | --- |
| `openCart` | “abrir carrito”, “ir a la cesta” | “open cart”, “show basket” | Opens dashboard → Home tab. |
| `searchFlight` | “buscar vuelo 1234” | “search flight 1234” | Switches to Search tab and surfaces the dictated flight number. |
| `goBack` | “volver”, “atrás”, “regresar” | “go back”, “return” | Simulates the previous screen (transfer → dashboard, login → welcome, etc.). |
| `createOrder` | “crear pedido”, “generar pedido” | “create order” | Opens the transfer/order flow. |
| `openSettings` | “abrir ajustes/configuración” | “open settings” | Navigates to the Settings tab. |

Locale detection comes from `expo-localization` and defaults to **es-MX** when the OS is in Spanish (Mexico); otherwise we fall back to es-ES or en-US.

## Privacy & Audio Focus

- Audio is never stored—`VoiceButton` and `useVoiceCommands` start and stop the mic for each push-to-talk interaction.
- The hook manages audio focus via `expo-av`:
  - Android requests `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK`.
  - iOS switches `AVAudioSession` to PlayAndRecord with ducking enabled.
- When focus is lost (e.g., TalkBack speaks), listening stops automatically and the user is notified.

## Development Notes

- Voice utilities live under `src/voice/`:
  - `intents.ts`: declarative map of supported phrases per locale plus confirmation strings.
  - `state.ts`: reducer and shared types for unit testing.
  - `useVoiceCommands.tsx`: hook that wraps permission handling, audio focus, ASR events, intent dispatching, telemetry buckets, and accessibility announcements.
  - `VoiceButton.tsx`: floating push-to-talk component with visible recording indicator and accessibility hints.
- Settings now expose a “Comandos de voz” switch with basic legal copy and locale info.
- `SearchScreen` can display a “voice dictated flight” banner so users understand what was captured and can clear the value via UI.

## Testing

- **Unit tests** live in `__tests__/` and cover:
  - Regex→intent matching.
  - Voice state reducer transitions.
- Run them with:

```bash
npm test
```

## Known Limitations

- `@react-native-voice/voice` requires native compilation; you need to prebuild/submit through EAS before testing on devices.
- Background/continuous listening is intentionally not supported to avoid conflicts with system-level accessibility services.
- Speech recognition quality depends on device hardware and ambient noise. We document this in Settings and README, but QA on physical devices is recommended.
