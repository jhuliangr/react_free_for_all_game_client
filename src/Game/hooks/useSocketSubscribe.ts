import {
  gameSocket,
  type CombatEventMessage,
  type StateUpdateMessage,
  type WelcomeMessage,
} from '#shared/services/websocket';
import { useGameStore, useSettingsStore } from '#shared/stores';
import type { Achivement } from '#shared/services/game';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

function checkAchievements(kills: number, level: number): Achivement | null {
  const { achievements, unlockedAchievementIds, unlockAchievement } =
    useSettingsStore.getState();
  const conditionChecks: Record<string, number> = { kills, level };
  for (const ach of achievements) {
    if (unlockedAchievementIds.includes(ach.id)) continue;
    const playerValue = conditionChecks[ach.condition.type];
    if (playerValue !== undefined && playerValue >= ach.condition.value) {
      const isNew = unlockAchievement(ach.id);
      if (isNew) return ach;
    }
  }
  return null;
}

export function useSocketSubscribe() {
  const [joined, setJoined] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [lastUnlockedAchievement, setLastUnlockedAchievement] =
    useState<Achivement | null>(null);
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
          reset();
          setMyPlayerId(welcome.playerId);
          applyStateUpdate([welcome.player], []);
          setJoined(true);
          setReconnecting(false);
          break;
        }
        case 'state_update': {
          const update = msg as StateUpdateMessage;
          applyStateUpdate(update.players, update.removed ?? []);
          const myId = useGameStore.getState().myPlayerId;
          const me = myId ? useGameStore.getState().players[myId] : null;
          if (me) {
            const unlocked = checkAchievements(me.kills, me.level);
            if (unlocked) setLastUnlockedAchievement(unlocked);
          }
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
        const myId = useGameStore.getState().myPlayerId;
        reset();
        const { selectedCharacter } = useSettingsStore.getState();
        gameSocket.join(
          playerNameRef.current,
          myId ?? undefined,
          selectedCharacter,
        );
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
    const { selectedCharacter } = useSettingsStore.getState();
    gameSocket.join(name, undefined, selectedCharacter);
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

  return {
    joined,
    reconnecting,
    join,
    leave,
    lost,
    lastUnlockedAchievement,
    clearAchievementNotification: () => setLastUnlockedAchievement(null),
  };
}
