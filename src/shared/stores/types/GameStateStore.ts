import type {
  CombatEventMessage,
  Player,
  PlayerDiff,
} from '#shared/services/websocket';

export type GameStateStore = {
  myPlayerId: string | null;
  players: Record<string, Player>;
  lastSeenAt: Record<string, number>;
  lastCombatEvent: CombatEventMessage | null;

  setMyPlayerId: (id: string) => void;
  applyStateUpdate: (diffs: PlayerDiff[]) => void;
  setCombatEvent: (e: CombatEventMessage) => void;
  reset: () => void;
};
