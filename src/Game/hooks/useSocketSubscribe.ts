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
  const { setMyPlayerId, updatePlayers, setCombatEvent, reset } =
    useGameStore();

  useEffect(() => {
    gameSocket.connect();

    const unsub = gameSocket.onMessage((msg) => {
      switch (msg.type) {
        case 'welcome': {
          const welcome = msg as WelcomeMessage;
          setMyPlayerId(welcome.playerId);
          updatePlayers([welcome.player]);
          setJoined(true);
          break;
        }
        case 'state_update':
          updatePlayers((msg as StateUpdateMessage).players);
          break;
        case 'combat_event':
          setCombatEvent(msg as CombatEventMessage);
          break;
      }
    });

    return () => {
      unsub();
      gameSocket.disconnect();
    };
  }, [setCombatEvent, setMyPlayerId, updatePlayers]);

  const leave = useCallback(() => {
    gameSocket.disconnect();
    gameSocket.connect();
    reset();
    setJoined(false);
  }, [reset]);

  return { joined, leave };
}
