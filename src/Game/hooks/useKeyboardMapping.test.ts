import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const move = vi.fn();
vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    move: (...args: unknown[]) => move(...args),
  },
}));

import { useKeyboardMapping } from './useKeyboardMapping';

describe('useKeyboardMapping hook works as expected', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    move.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not send moves when not joined', () => {
    renderHook(() => useKeyboardMapping(false));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(move).not.toHaveBeenCalled();
  });

  it('sends a move call while a direction key is held down', () => {
    renderHook(() => useKeyboardMapping(true));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    act(() => {
      vi.advanceTimersByTime(60);
    });
    expect(move).toHaveBeenCalledWith(0, -1);
  });

  it('stops sending moves once the key is released', () => {
    renderHook(() => useKeyboardMapping(true));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    act(() => {
      vi.advanceTimersByTime(60);
    });
    move.mockClear();
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }));
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(move).not.toHaveBeenCalled();
  });
});
