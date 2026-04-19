import {
  gameSocket,
  type CombatEventMessage,
  type StateUpdateMessage,
} from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';

const HEAL_SOUND_PATH = `${import.meta.env.BASE_URL}assets/sounds/heal.mp3`;

// Pickups disappear from server updates either because they were consumed or
// because they left visibility range. Only treat a disappearance as a pickup
// when it vanishes close to the local player.
const PICKUP_PROXIMITY_WORLD_UNITS = 40;

async function loadSound(
  ctx: AudioContext,
  url: string,
): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return ctx.decodeAudioData(arrayBuffer);
  } catch {
    return null;
  }
}

function playBuffer(ctx: AudioContext, buffer: AudioBuffer) {
  const play = () => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(play);
  } else {
    play();
  }
}

type CharacterSounds = {
  attack: AudioBuffer | null;
  hit: AudioBuffer | null;
};

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<Record<string, CharacterSounds>>({});
  const healSoundRef = useRef<AudioBuffer | null>(null);
  const prevPickupsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map(),
  );

  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    for (const charDef of characterRegistry.getAll()) {
      Promise.all([
        loadSound(ctx, charDef.getAttackSoundPath()),
        loadSound(ctx, charDef.getHitSoundPath()),
      ]).then(([attack, hit]) => {
        soundsRef.current[charDef.id] = { attack, hit };
      });
    }

    loadSound(ctx, HEAL_SOUND_PATH).then((buffer) => {
      healSoundRef.current = buffer;
    });

    return () => {
      ctx.close();
    };
  }, []);

  useEffect(() => {
    const unsub = gameSocket.onMessage((msg) => {
      if (msg.type !== 'state_update') return;
      const { pickups } = msg as StateUpdateMessage;

      const prev = prevPickupsRef.current;
      const next = new Map<string, { x: number; y: number }>();
      for (const p of pickups) next.set(p.id, { x: p.x, y: p.y });

      const { myPlayerId, players } = useGameStore.getState();
      const me = myPlayerId ? players[myPlayerId] : null;

      if (me) {
        for (const [id, pos] of prev) {
          if (next.has(id)) continue;
          const dx = pos.x - me.x;
          const dy = pos.y - me.y;
          if (
            dx * dx + dy * dy <=
            PICKUP_PROXIMITY_WORLD_UNITS * PICKUP_PROXIMITY_WORLD_UNITS
          ) {
            if (ctxRef.current && healSoundRef.current) {
              playBuffer(ctxRef.current, healSoundRef.current);
            }
            break;
          }
        }
      }

      prevPickupsRef.current = next;
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = gameSocket.onMessage((msg) => {
      if (msg.type !== 'combat_event') return;
      const { attackerId, defenderId } = msg as CombatEventMessage;
      const { myPlayerId, players } = useGameStore.getState();
      if (attackerId !== myPlayerId && defenderId !== myPlayerId) return;

      const attacker = players[attackerId];
      const charId = attacker?.character ?? 'knight';
      const charSounds = soundsRef.current[charId];
      if (ctxRef.current && charSounds?.hit) {
        playBuffer(ctxRef.current, charSounds.hit);
      }
    });
    return unsub;
  }, []);

  const playAttackSound = (characterId: string) => {
    const charSounds = soundsRef.current[characterId];
    if (ctxRef.current && charSounds?.attack) {
      playBuffer(ctxRef.current, charSounds.attack);
    }
  };

  return { playAttackSound };
}
