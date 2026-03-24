import {
  gameSocket,
  type CombatEventMessage,
  type StateUpdateMessage,
  type WelcomeMessage,
} from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useCallback, useEffect, useState } from 'react';

export function useSocketSubscribe() {
  const [joined, setJoined] = useState(false);
  const { setMyPlayerId, applyStateUpdate, setCombatEvent, reset } =
    useGameStore();

  useEffect(() => {
    gameSocket.connect();

    const unsub = gameSocket.onMessage((msg) => {
      switch (msg.type) {
        case 'welcome': {
          const welcome = msg as WelcomeMessage;
          setMyPlayerId(welcome.playerId);
          applyStateUpdate([welcome.player], []);
          setJoined(true);
          break;
        }
        case 'state_update': {
          const update = msg as StateUpdateMessage;
          applyStateUpdate(update.players, update.removed ?? []);
          break;
        }
        case 'combat_event':
          setCombatEvent(msg as CombatEventMessage);
          break;
      }
    });

    return () => {
      unsub();
      gameSocket.disconnect();
    };
  }, [setCombatEvent, setMyPlayerId, applyStateUpdate]);

  const leave = useCallback(() => {
    gameSocket.disconnect();
    gameSocket.connect();
    reset();
    setJoined(false);
  }, [reset]);

  return { joined, leave };
}
