import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { Player } from '#shared/services/websocket';
import { useDeathDetection } from './useDeathDetection';

const basePlayer: Player = {
  id: 'p1',
  name: 'One',
  x: 0,
  y: 0,
  hp: 100,
  max_hp: 100,
  level: 1,
  xp: 0,
  kills: 0,
  deaths: 0,
  skin: 'default',
  weapon: 'sword',
  character: 'knight',
};

describe('useDeathDetection hook works as expected', () => {
  it('does not call leave when hp is greater than zero', () => {
    const leave = vi.fn();
    renderHook(() => useDeathDetection(basePlayer, leave));
    expect(leave).not.toHaveBeenCalled();
  });

  it('calls leave when hp drops to zero', () => {
    const leave = vi.fn();
    renderHook(() => useDeathDetection({ ...basePlayer, hp: 0 }, leave));
    expect(leave).toHaveBeenCalledTimes(1);
  });

  it('does not call leave when the player is null', () => {
    const leave = vi.fn();
    renderHook(() => useDeathDetection(null, leave));
    expect(leave).not.toHaveBeenCalled();
  });
});
