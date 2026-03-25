import { gameSocket, type CombatEventMessage } from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useEffect, useRef } from 'react';

export function useOtherPlayersAttacks(myPlayerId: string | null) {
  const activeAttacksRef = useRef<Record<string, { angle: number; startTime: number }>>({});

  useEffect(() => {
    const unsub = gameSocket.onMessage((msg) => {
      if (msg.type !== 'combat_event') return;
      const { attackerId, defenderId } = msg as CombatEventMessage;
      if (attackerId === myPlayerId) return;

      const { players } = useGameStore.getState();
      const attacker = players[attackerId];
      const defender = players[defenderId];
      if (!attacker || !defender) return;

      const angle = Math.atan2(defender.y - attacker.y, defender.x - attacker.x);
      activeAttacksRef.current = {
        ...activeAttacksRef.current,
        [attackerId]: { angle, startTime: Date.now() },
      };

      setTimeout(() => {
        const next = { ...activeAttacksRef.current };
        delete next[attackerId];
        activeAttacksRef.current = next;
      }, 360);
    });
    return unsub;
  }, [myPlayerId]);

  return activeAttacksRef;
}
