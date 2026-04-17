import type { Player, PlayerDiff } from '#shared/services/websocket';
import { create } from 'zustand';
import type { GameStateStore } from './types/GameStateStore';

// Keep players on-screen at their last known position for this long after
// their previous update. The server throttles mid-range players (250–500u
// away) to every third tick, i.e. ~150ms between updates. A 1-second window
// comfortably absorbs that while still dropping players who genuinely leave
// visibility (they never reappear in subsequent diffs).
const SEEN_GRACE_MS = 1000;

export const useGameStore = create<GameStateStore>()((set, get) => ({
  myPlayerId: null,
  players: {},
  lastSeenAt: {},
  lastCombatEvent: null,

  setMyPlayerId: (id) => set({ myPlayerId: id }),

  applyStateUpdate: (diffs: PlayerDiff[]) => {
    // The server's `removed` list is ignored intentionally: it does not
    // distinguish between "left visibility" and "throttled this tick", so
    // honoring it causes mid-range players to blink in and out. We rely on
    // SEEN_GRACE_MS below to age out players who truly disappear.
    const { myPlayerId, players, lastSeenAt } = get();
    const updated = { ...players };
    const seen = { ...lastSeenAt };
    const now = performance.now();

    diffs.forEach((diff) => {
      updated[diff.id] = updated[diff.id]
        ? { ...updated[diff.id], ...diff }
        : (diff as Player);
      seen[diff.id] = now;
    });

    for (const id of Object.keys(updated)) {
      if (id === myPlayerId) continue;
      const last = seen[id];
      if (last === undefined || now - last > SEEN_GRACE_MS) {
        delete updated[id];
        delete seen[id];
      }
    }

    set({ players: updated, lastSeenAt: seen });
  },

  setCombatEvent: (e) => set({ lastCombatEvent: e }),

  reset: () =>
    set({
      myPlayerId: null,
      players: {},
      lastSeenAt: {},
      lastCombatEvent: null,
    }),
}));
