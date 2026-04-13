import {
  gameSocket,
  type CombatEventMessage,
} from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';

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

    return () => {
      ctx.close();
    };
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
