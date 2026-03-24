import { create } from 'zustand';
import type { Player } from '#shared/services/websocket';
import type { GameStateStore } from './types/GameStateStore';

export const useGameStore = create<GameStateStore>()((set, get) => ({
  myPlayerId: null,
  players: {},
  lastCombatEvent: null,

  setMyPlayerId: (id) =>
    set({
      myPlayerId: id,
    }),

  updatePlayers: (newPlayers) => {
    const myId = get().myPlayerId;
    const current = get().players;
    const updated: Record<string, Player> = {};
    newPlayers.forEach((p) => {
      updated[p.id] = p;
    });
    // Preserve own player if the server didn't include it in this update
    if (myId && current[myId] && !updated[myId]) {
      updated[myId] = current[myId];
    }
    set({ players: updated });
  },

  setCombatEvent: (e) =>
    set({
      lastCombatEvent: e,
    }),

  reset: () =>
    set({
      myPlayerId: null,
      players: {},
      lastCombatEvent: null,
    }),
}));
