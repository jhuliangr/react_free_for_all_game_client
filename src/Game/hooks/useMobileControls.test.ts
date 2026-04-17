import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const move = vi.fn();
const attack = vi.fn();
vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    move: (...args: unknown[]) => move(...args),
    attack: (...args: unknown[]) => attack(...args),
  },
}));

import { useMobileControls } from './useMobileControls';

describe('useMobileControls hook works as expected', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    move.mockClear();
    attack.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes joystick handlers and refs', () => {
    const { result } = renderHook(() => useMobileControls(true));
    expect(typeof result.current.onMoveJoystick).toBe('function');
    expect(typeof result.current.onAttackJoystick).toBe('function');
    expect(typeof result.current.onAttackEnd).toBe('function');
    expect(result.current.attackFlashRef).toHaveProperty('current');
  });

  it('sends a move once the joystick exceeds the deadzone', () => {
    const { result } = renderHook(() => useMobileControls(true));
    act(() => {
      result.current.onMoveJoystick(1, 0);
      vi.advanceTimersByTime(60);
    });
    expect(move).toHaveBeenCalledWith(1, 0);
  });

  it('ignores tiny joystick movements inside the deadzone', () => {
    const { result } = renderHook(() => useMobileControls(true));
    act(() => {
      result.current.onMoveJoystick(0.05, 0.05);
      vi.advanceTimersByTime(100);
    });
    expect(move).not.toHaveBeenCalled();
  });
});
