import { useCallback, useRef } from 'react';

type Props = {
  onMove: (dx: number, dy: number) => void;
  onEnd?: () => void;
  side: 'left' | 'right';
};

const BASE_SIZE = 120;
const KNOB_SIZE = 50;
const MAX_DISTANCE = (BASE_SIZE - KNOB_SIZE) / 2;

export const Joystick: React.FC<Props> = ({ onMove, onEnd, side }) => {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const base = baseRef.current;
      const knob = knobRef.current;
      if (!base || !knob) return;

      const rect = base.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > MAX_DISTANCE) {
        dx = (dx / dist) * MAX_DISTANCE;
        dy = (dy / dist) * MAX_DISTANCE;
      }

      knob.style.transform = `translate(${dx}px, ${dy}px)`;

      const normalizedDx = dx / MAX_DISTANCE;
      const normalizedDy = dy / MAX_DISTANCE;
      onMove(normalizedDx, normalizedDy);
    },
    [onMove],
  );

  const handleEnd = useCallback(() => {
    const knob = knobRef.current;
    if (knob) knob.style.transform = 'translate(0px, 0px)';
    activeTouch.current = null;
    onMove(0, 0);
    onEnd?.();
  }, [onMove, onEnd]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (activeTouch.current !== null) return;
      const touch = e.changedTouches[0];
      activeTouch.current = touch.identifier;
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouch.current) {
          handleMove(touch.clientX, touch.clientY);
          break;
        }
      }
    },
    [handleMove],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeTouch.current) {
          handleEnd();
          break;
        }
      }
    },
    [handleEnd],
  );

  return (
    <div
      ref={baseRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      className="absolute bottom-12 z-50 select-none"
      style={{
        [side === 'left' ? 'left' : 'right']: '50px',
        width: BASE_SIZE,
        height: BASE_SIZE,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        border: '2px solid rgba(255,255,255,0.25)',
        touchAction: 'none',
      }}
    >
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          width: KNOB_SIZE,
          height: KNOB_SIZE,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
          border: '2px solid rgba(255,255,255,0.4)',
          top: '50%',
          left: '50%',
          marginTop: -KNOB_SIZE / 2,
          marginLeft: -KNOB_SIZE / 2,
          transform: 'translate(0px, 0px)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
