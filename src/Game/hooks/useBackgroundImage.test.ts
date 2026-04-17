import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBackgroundImage } from './useBackgroundImage';

describe('useBackgroundImage hook works as expected', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useBackgroundImage());
    expect(result.current).toHaveProperty('current');
  });

  it('starts with a null image reference', () => {
    const { result } = renderHook(() => useBackgroundImage());
    expect(result.current.current).toBeNull();
  });

  it('keeps the same ref identity between renders', () => {
    const { result, rerender } = renderHook(() => useBackgroundImage());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
