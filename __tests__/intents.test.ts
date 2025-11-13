import { describe, expect, it } from 'vitest';
import { matchIntent } from '../src/voice/intents';

describe('voice intent matching', () => {
  it('matches cart intents in es-MX', () => {
    const match = matchIntent('abrir carrito', 'es-MX');
    expect(match?.id).toBe('openCart');
  });

  it('captures flight numbers from English commands', () => {
    const match = matchIntent('search flight 9876', 'en-US');
    expect(match?.id).toBe('searchFlight');
    expect(match?.slots.flightNumber).toBe('9876');
  });

  it('falls back across locales when needed', () => {
    const match = matchIntent('open settings', 'es-MX');
    expect(match?.id).toBe('openSettings');
  });
});
