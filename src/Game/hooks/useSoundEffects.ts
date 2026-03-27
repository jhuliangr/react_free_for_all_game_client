import {
  gameSocket,
  type CombatEventMessage,
} from '#shared/services/websocket';
import { useGameStore } from '#shared/stores';
import { useEffect, useRef } from 'react';

async function loadSound(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
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

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);
  const sliceRef = useRef<AudioBuffer | null>(null);
  const hitRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    Promise.all([
      loadSound(ctx, '/assets/sounds/sword-slice.mp3'),
      loadSound(ctx, '/assets/sounds/sword-hit.mp3'),
    ]).then(([slice, hit]) => {
      sliceRef.current = slice;
      hitRef.current = hit;
    });

    return () => {
      ctx.close();
    };
  }, []);

  useEffect(() => {
    const unsub = gameSocket.onMessage((msg) => {
      if (msg.type !== 'combat_event') return;
      const { attackerId, defenderId } = msg as CombatEventMessage;
      const { myPlayerId } = useGameStore.getState();
      if (attackerId !== myPlayerId && defenderId !== myPlayerId) return;
      if (ctxRef.current && hitRef.current)
        playBuffer(ctxRef.current, hitRef.current);
    });
    return unsub;
  }, []);

  const playSlice = () => {
    if (ctxRef.current && sliceRef.current)
      playBuffer(ctxRef.current, sliceRef.current);
  };

  return { playSlice };
}
