import type { Player, PlayerDiff } from '#shared/services/websocket';
import { create } from 'zustand';
import type { GameStateStore } from './types/GameStateStore';

export const useGameStore = create<GameStateStore>()((set, get) => ({
  myPlayerId: null,
  players: {},
  lastCombatEvent: null,

  setMyPlayerId: (id) => set({ myPlayerId: id }),

  applyStateUpdate: (diffs: PlayerDiff[], removed: string[] = []) => {
    const { myPlayerId, players } = get();
    const updated = { ...players };

    removed.forEach((id) => {
      if (id !== myPlayerId) delete updated[id];
    });

    diffs.forEach((diff) => {
      updated[diff.id] = updated[diff.id]
        ? { ...updated[diff.id], ...diff }
        : (diff as Player);
    });

    set({ players: updated });
  },

  setCombatEvent: (e) => set({ lastCombatEvent: e }),

  reset: () => set({ myPlayerId: null, players: {}, lastCombatEvent: null }),
}));
