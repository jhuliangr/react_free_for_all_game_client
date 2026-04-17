import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

const attack = vi.fn();
vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    attack: (...args: unknown[]) => attack(...args),
  },
}));

import { useAttackAnimation } from './useAttackAnimation';

describe('useAttackAnimation hook works as expected', () => {
  it('returns a handleCanvasClick callback and refs', () => {
    const { result } = renderHook(() => useAttackAnimation());
    expect(typeof result.current.handleCanvasClick).toBe('function');
    expect(result.current.attackFlashRef).toHaveProperty('current');
    expect(result.current.cooldownActiveRef).toHaveProperty('current');
  });

  it('starts with null attackFlashRef and inactive cooldown', () => {
    const { result } = renderHook(() => useAttackAnimation());
    expect(result.current.attackFlashRef.current).toBeNull();
    expect(result.current.cooldownActiveRef.current).toBe(false);
  });

  it('accepts an optional onAttack callback without errors', () => {
    const onAttack = vi.fn();
    const { result } = renderHook(() => useAttackAnimation(onAttack));
    expect(result.current).toBeDefined();
  });
});
