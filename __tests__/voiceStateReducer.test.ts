import { describe, expect, it } from 'vitest';
import {
  initialVoiceState,
  voiceStateReducer,
  VoiceCommandState,
  VoiceStateEvent,
} from '../src/voice/state';

const reduce = (events: VoiceStateEvent[]) =>
  events.reduce((state, event) => voiceStateReducer(state, event), initialVoiceState);

describe('voice state reducer', () => {
  it('transitions to listening on start event', () => {
    const next = voiceStateReducer(initialVoiceState, { type: 'start' });
    expect(next.listening).toBe(true);
    expect(next.status).toBe('listening');
  });

  it('stores transcript when processing', () => {
    const next = reduce([
      { type: 'start' },
      { type: 'processing', transcript: 'abrir carrito' },
    ]);
    expect(next.transcript).toBe('abrir carrito');
    expect(next.status).toBe('processing');
  });

  it('resets on stop event', () => {
    const next = reduce([
      { type: 'start' },
      { type: 'processing', transcript: 'hola' },
      { type: 'stop' },
    ]);
    expect(next.listening).toBe(false);
    expect(next.status).toBe('idle');
    expect(next.transcript).toBe('');
  });

  it('marks errors without losing transcript immediately', () => {
    const startState = {
      listening: true,
      status: 'processing',
      transcript: 'abrir ajustes',
    } as VoiceCommandState;
    const next = voiceStateReducer(startState, { type: 'error' });
    expect(next.status).toBe('error');
    expect(next.transcript).toBe('abrir ajustes');
  });
});
