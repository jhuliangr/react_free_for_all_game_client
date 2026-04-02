import {
  gameSocket,
  type CombatEventMessage,
  type StateUpdateMessage,
  type WelcomeMessage,
} from '#shared/services/websocket';
import { useGameStore, useSettingsStore } from '#shared/stores';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export function useSocketSubscribe() {
  const [joined, setJoined] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const { setMyPlayerId, applyStateUpdate, setCombatEvent, reset } =
    useGameStore();
  const navigate = useNavigate();
  const playerNameRef = useRef<string | null>(null);

  useEffect(() => {
    gameSocket.connect();

    const unsubMessage = gameSocket.onMessage((msg) => {
      switch (msg.type) {
        case 'welcome': {
          const welcome = msg as WelcomeMessage;
          setMyPlayerId(welcome.playerId);
          applyStateUpdate([welcome.player], []);
          setJoined(true);
          setReconnecting(false);
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
      if (playerNameRef.current) {
        setReconnecting(true);
        const selectedCharacter = useSettingsStore.getState().selectedCharacter;
        gameSocket.join(playerNameRef.current);
        gameSocket.equip('character', selectedCharacter.toLowerCase());
      }
    });

    const unsubReconnectFail = gameSocket.onReconnectFail(() => {
      setReconnecting(false);
      reset();
      setJoined(false);
      navigate('/play', { replace: true });
    });

    return () => {
      unsubMessage();
      unsubClose();
      unsubReconnectFail();
      gameSocket.disconnect();
    };
  }, [setCombatEvent, setMyPlayerId, applyStateUpdate, reset, navigate]);

  const join = useCallback((name: string) => {
    playerNameRef.current = name;
    gameSocket.join(name);
  }, []);

  const leave = useCallback(() => {
    playerNameRef.current = null;
    gameSocket.disconnect();
    gameSocket.connect();
    reset();
    setJoined(false);
    navigate('/play', {
      replace: true,
    });
  }, [reset, navigate]);

  const lost = useCallback(() => {
    playerNameRef.current = null;
    gameSocket.disconnect();
    gameSocket.connect();
    reset();
    setJoined(false);
    navigate('/game-over', {
      replace: true,
    });
  }, [reset, navigate]);

  return { joined, reconnecting, join, leave, lost };
}
