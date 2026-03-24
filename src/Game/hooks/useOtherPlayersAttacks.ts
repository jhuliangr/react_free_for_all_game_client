import {
  gameSocket,
  type CombatEventMessage,
} from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useEffect, useState } from 'react';

export function useOtherPlayersAttacks(myPlayerId: string | null) {
  const [activeAttacks, setActiveAttacks] = useState<
    Record<string, { angle: number; startTime: number }>
  >({});

  useEffect(() => {
    const unsub = gameSocket.onMessage((msg) => {
      if (msg.type !== 'combat_event') return;
      const { attackerId, defenderId } = msg as CombatEventMessage;
      if (attackerId === myPlayerId) return;

      const { players } = useGameStore.getState();
      const attacker = players[attackerId];
      const defender = players[defenderId];
      if (!attacker || !defender) return;

      const angle = Math.atan2(
        defender.y - attacker.y,
        defender.x - attacker.x,
      );
      const startTime = Date.now();

      setActiveAttacks((prev) => ({
        ...prev,
        [attackerId]: { angle, startTime },
      }));
      setTimeout(() => {
        setActiveAttacks((prev) => {
          const next = { ...prev };
          delete next[attackerId];
          return next;
        });
      }, 360);
    });
    return unsub;
  }, [myPlayerId]);

  return activeAttacks;
}
