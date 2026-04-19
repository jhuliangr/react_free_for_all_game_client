import {
  gameSocket,
  type CombatEventMessage,
  type KickedMessage,
  type StateUpdateMessage,
  type WelcomeMessage,
} from '#shared/services/websocket';
import { useGameStore, useSettingsStore } from '#shared/stores';
import type { Achivement } from '#shared/services/game';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { predictionEngine } from '../engine/predictionEngine';

const PLAYER_ID_KEY = 'multiplayer.playerId';

function loadStoredPlayerId(): string | undefined {
  try {
    return localStorage.getItem(PLAYER_ID_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

function storePlayerId(id: string) {
  try {
    localStorage.setItem(PLAYER_ID_KEY, id);
  } catch {
    /* storage unavailable — best effort */
  }
}

function clearStoredPlayerId() {
  try {
    localStorage.removeItem(PLAYER_ID_KEY);
  } catch {
    /* storage unavailable — best effort */
  }
}

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
  const { setMyPlayerId, applyStateUpdate, setCombatEvent, setPickups, reset } =
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
          predictionEngine.reset();
          gameSocket.resetClientTick();
          setMyPlayerId(welcome.playerId);
          storePlayerId(welcome.playerId);
          applyStateUpdate([welcome.player]);
          predictionEngine.onWelcome(welcome);
          setJoined(true);
          setReconnecting(false);
          break;
        }
        case 'state_update': {
          const update = msg as StateUpdateMessage;
          applyStateUpdate(update.players);
          setPickups(update.pickups);
          predictionEngine.onStateUpdate(update);
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
        case 'kicked': {
          const kicked = msg as KickedMessage;
          console.warn(
            'Session taken over by another connection:',
            kicked.reason,
          );
          playerNameRef.current = null;
          clearStoredPlayerId();
          reset();
          predictionEngine.reset();
          setJoined(false);
          setReconnecting(false);
          gameSocket.disconnect();
          gameSocket.connect();
          navigate('/play', {
            replace: true,
            state: { kicked: kicked.reason },
          });
          break;
        }
      }
    });

    const unsubClose = gameSocket.onClose(() => {
      if (playerNameRef.current) {
        setReconnecting(true);
        const myId = useGameStore.getState().myPlayerId ?? loadStoredPlayerId();
        reset();
        predictionEngine.reset();
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
  }, [
    setCombatEvent,
    setMyPlayerId,
    applyStateUpdate,
    setPickups,
    reset,
    navigate,
  ]);

  const join = useCallback((name: string) => {
    playerNameRef.current = name;
    const { selectedCharacter } = useSettingsStore.getState();
    const storedId = loadStoredPlayerId();
    gameSocket.join(name, storedId, selectedCharacter);
  }, []);

  const leave = useCallback(() => {
    playerNameRef.current = null;
    clearStoredPlayerId();
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
    clearStoredPlayerId();
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
