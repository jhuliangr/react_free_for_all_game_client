import type { Player } from '#shared/services/websocket';

export type GameStateStore = {
  myPlayerId: string | null;
  players: Record<string, Player>;
  lastCombatEvent: {
    attackerId: string;
    defenderId: string;
    damage: number;
  } | null;

  setMyPlayerId: (id: string) => void;
  updatePlayers: (players: Player[]) => void;
  setCombatEvent: (e: {
    attackerId: string;
    defenderId: string;
    damage: number;
  }) => void;
  reset: () => void;
};
