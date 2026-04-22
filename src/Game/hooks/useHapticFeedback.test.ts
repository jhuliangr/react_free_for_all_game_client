import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const { handlers, getState } = vi.hoisted(() => ({
  handlers: [] as ((msg: unknown) => void)[],
  getState: vi.fn(),
}));

vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    onMessage: (h: (msg: unknown) => void) => {
      handlers.push(h);
      return () => {
        const i = handlers.indexOf(h);
        if (i >= 0) handlers.splice(i, 1);
      };
    },
  },
}));

vi.mock('#shared/stores', () => ({
  useGameStore: {
    getState: () => getState(),
  },
}));

import { useHapticFeedback } from './useHapticFeedback';

const fireCombat = (msg: {
  attackerId: string;
  defenderId: string;
  damage: number;
}) => {
  handlers.forEach((h) => h({ type: 'combat_event', ...msg }));
};

describe('useHapticFeedback', () => {
  const vibrate = vi.fn();

  beforeEach(() => {
    handlers.length = 0;
    vibrate.mockClear();
    getState.mockReturnValue({ myPlayerId: 'me' });
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: vibrate,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: undefined,
    });
  });

  it('vibrates when the local player is the defender', () => {
    renderHook(() => useHapticFeedback());
    fireCombat({ attackerId: 'other', defenderId: 'me', damage: 5 });
    expect(vibrate).toHaveBeenCalledWith(30);
  });

  it('does not vibrate when someone else takes damage', () => {
    renderHook(() => useHapticFeedback());
    fireCombat({ attackerId: 'me', defenderId: 'other', damage: 5 });
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('throttles bursts so continuous DoT ticks do not buzz forever', () => {
    renderHook(() => useHapticFeedback());
    fireCombat({ attackerId: 'dot', defenderId: 'me', damage: 1 });
    fireCombat({ attackerId: 'dot', defenderId: 'me', damage: 1 });
    fireCombat({ attackerId: 'dot', defenderId: 'me', damage: 1 });
    expect(vibrate).toHaveBeenCalledTimes(1);
  });

  it('is a no-op when the platform has no vibrate API', () => {
    Object.defineProperty(navigator, 'vibrate', {
      configurable: true,
      value: undefined,
    });
    renderHook(() => useHapticFeedback());
    fireCombat({ attackerId: 'other', defenderId: 'me', damage: 5 });
    expect(vibrate).not.toHaveBeenCalled();
  });
});
