import type {
  CombatEventMessage,
  Player,
  PlayerDiff,
} from '#shared/services/websocket';

export type GameStateStore = {
  myPlayerId: string | null;
  players: Record<string, Player>;
  lastCombatEvent: CombatEventMessage | null;

  setMyPlayerId: (id: string) => void;
  applyStateUpdate: (diffs: PlayerDiff[], removed: string[]) => void;
  setCombatEvent: (e: CombatEventMessage) => void;
  reset: () => void;
};
