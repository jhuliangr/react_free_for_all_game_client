import {
  gameSocket,
  type CombatEventMessage,
  type StateUpdateMessage,
  type WelcomeMessage,
} from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export function useSocketSubscribe() {
  const [joined, setJoined] = useState(false);
  const { setMyPlayerId, applyStateUpdate, setCombatEvent, reset } =
    useGameStore();
  const navigate = useNavigate();
  useEffect(() => {
    gameSocket.connect();

    const unsubMessage = gameSocket.onMessage((msg) => {
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

    const unsubClose = gameSocket.onClose(() => {
      gameSocket.connect();
      reset();
      setJoined(false);
    });

    return () => {
      unsubMessage();
      unsubClose();
      gameSocket.disconnect();
    };
  }, [setCombatEvent, setMyPlayerId, applyStateUpdate, reset]);

  const leave = useCallback(() => {
    gameSocket.disconnect();
    gameSocket.connect();
    reset();
    setJoined(false);
    navigate('/game-over', {
      replace: true,
    });
  }, [reset, navigate]);

  return { joined, leave };
}
