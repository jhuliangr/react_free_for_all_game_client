import type {
  CombatEventMessage,
  Pickup,
  Player,
  PlayerDiff,
} from '#shared/services/websocket';

export type GameStateStore = {
  myPlayerId: string | null;
  players: Record<string, Player>;
  lastSeenAt: Record<string, number>;
  lastCombatEvent: CombatEventMessage | null;
  pickups: Pickup[];

  setMyPlayerId: (id: string) => void;
  applyStateUpdate: (diffs: PlayerDiff[]) => void;
  setCombatEvent: (e: CombatEventMessage) => void;
  setPickups: (pickups: Pickup[]) => void;
  reset: () => void;
};
