import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsPortrait } from './useIsPortrait';

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql = {
    matches,
    media: '(orientation: portrait)',
    addEventListener: vi.fn((_: string, fn: (e: MediaQueryListEvent) => void) =>
      listeners.push(fn),
    ),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return { mql, listeners };
}

describe('useIsPortrait hook works as expected', () => {
  it('returns true when the orientation query matches', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsPortrait());
    expect(result.current).toBe(true);
  });

  it('returns false when the orientation query does not match', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useIsPortrait());
    expect(result.current).toBe(false);
  });

  it('updates when the matchMedia event fires', () => {
    const { mql, listeners } = mockMatchMedia(false);
    const { result } = renderHook(() => useIsPortrait());
    act(() => {
      mql.matches = true;
      listeners.forEach((fn) => fn({ matches: true } as MediaQueryListEvent));
    });
    expect(result.current).toBe(true);
  });
});
