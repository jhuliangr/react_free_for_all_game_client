import { gameSocket } from '#shared/services/websocket';
import { useEffect, useRef } from 'react';
import { predictionEngine } from '../engine/predictionEngine';

export function useKeyboardMapping(joined: boolean) {
  const keysRef = useRef<Set<string>>(new Set());
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!joined) return;

    tickRef.current = window.setInterval(() => {
      const keys = keysRef.current;
      let dx = 0,
        dy = 0;
      if (keys.has('ArrowUp') || keys.has('w')) dy = -1;
      if (keys.has('ArrowDown') || keys.has('s')) dy = 1;
      if (keys.has('ArrowLeft') || keys.has('a')) dx = -1;
      if (keys.has('ArrowRight') || keys.has('d')) dx = 1;
      if (dx === 0 && dy === 0) return;
      const tick = gameSocket.nextClientTick();
      predictionEngine.applyLocalMove(dx, dy, tick);
      gameSocket.move(dx, dy, tick);
    }, 50);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [joined]);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => keysRef.current.add(e.key);
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);
}
