import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlayerSprite } from './usePlayerSprite';

describe('usePlayerSprite hook works as expected', () => {
  it('returns a ref with a record container', () => {
    const { result } = renderHook(() => usePlayerSprite());
    expect(result.current).toHaveProperty('current');
    expect(typeof result.current.current).toBe('object');
  });

  it('starts with an empty sprite dictionary', () => {
    const { result } = renderHook(() => usePlayerSprite());
    expect(Object.keys(result.current.current)).toHaveLength(0);
  });

  it('keeps the same ref between renders', () => {
    const { result, rerender } = renderHook(() => usePlayerSprite());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
