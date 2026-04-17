import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const onMessage = vi.fn(() => () => {});
vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    onMessage: () => onMessage(),
  },
}));

class FakeAudioContext {
  state = 'running';
  destination = {};
  close = vi.fn();
  resume = vi.fn().mockResolvedValue(undefined);
  createBufferSource = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    buffer: null,
  }));
  decodeAudioData = vi.fn().mockResolvedValue(null);
}

// @ts-expect-error overriding global for test
globalThis.AudioContext = FakeAudioContext;

import { useSoundEffects } from './useSoundEffects';

describe('useSoundEffects hook works as expected', () => {
  it('returns a playAttackSound function', () => {
    const { result } = renderHook(() => useSoundEffects());
    expect(typeof result.current.playAttackSound).toBe('function');
  });

  it('subscribes to gameSocket messages on mount', () => {
    onMessage.mockClear();
    renderHook(() => useSoundEffects());
    expect(onMessage).toHaveBeenCalled();
  });

  it('playAttackSound is safe to call when no sounds are loaded yet', () => {
    const { result } = renderHook(() => useSoundEffects());
    expect(() => result.current.playAttackSound('knight')).not.toThrow();
  });
});
