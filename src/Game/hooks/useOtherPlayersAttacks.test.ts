import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

let storedHandler: ((msg: unknown) => void) | null = null;
const onMessage = vi.fn((handler: (msg: unknown) => void) => {
  storedHandler = handler;
  return () => {};
});

vi.mock('#shared/services/websocket', () => ({
  gameSocket: {
    onMessage: (h: (msg: unknown) => void) => onMessage(h),
  },
}));

import { useOtherPlayersAttacks } from './useOtherPlayersAttacks';
import { useGameStore } from '#shared/stores';

const basePlayer = {
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

describe('useOtherPlayersAttacks hook works as expected', () => {
  it('returns an empty active attacks ref initially', () => {
    const { result } = renderHook(() => useOtherPlayersAttacks('me'));
    expect(result.current.current).toEqual({});
  });

  it('subscribes to the gameSocket onMessage handler', () => {
    renderHook(() => useOtherPlayersAttacks('me'));
    expect(onMessage).toHaveBeenCalled();
  });

  it('ignores combat events coming from the current player', () => {
    useGameStore.setState({
      myPlayerId: 'me',
      players: { me: basePlayer, enemy: { ...basePlayer, id: 'enemy' } },
      lastCombatEvent: null,
    });
    const { result } = renderHook(() => useOtherPlayersAttacks('me'));
    storedHandler?.({
      type: 'combat_event',
      attackerId: 'me',
      defenderId: 'enemy',
      damage: 5,
    });
    expect(result.current.current).toEqual({});
  });
});
