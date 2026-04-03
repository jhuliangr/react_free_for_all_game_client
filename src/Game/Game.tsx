import { useRef } from 'react';
import { useGameStore } from '#shared/stores';
import { JoinGameForm } from './JoinGameForm';
import { Hud } from './Hud';
import {
  useAttackAnimation,
  useBackgroundImage,
  useCanvasRenderer,
  useDeathDetection,
  useKeyboardMapping,
  useOtherPlayersAttacks,
  usePlayerSprite,
  useSocketSubscribe,
  useSoundEffects,
} from './hooks';

export function Game() {
  const { joined, reconnecting, join, lost, leave } = useSocketSubscribe();
  useKeyboardMapping(joined);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { myPlayerId, players } = useGameStore();
  const me = myPlayerId ? players[myPlayerId] : null;

  const spriteRef = usePlayerSprite();
  const bgImageRef = useBackgroundImage();
  const activeAttacksRef = useOtherPlayersAttacks(myPlayerId);
  const { playSlice } = useSoundEffects();
  const { attackFlashRef, handleCanvasClick } = useAttackAnimation(playSlice);

  useDeathDetection(me, lost);
  useCanvasRenderer(
    canvasRef,
    spriteRef,
    attackFlashRef,
    activeAttacksRef,
    bgImageRef,
  );

  if (reconnecting) {
    return (
      <div className="flex items-center justify-center gap-3 p-4 bg-secondary rounded-md mx-auto">
        <p className="text-white">Reconnecting...</p>
      </div>
    );
  }

  if (!joined) return <JoinGameForm onJoin={join} />;

  return (
    <div className="max-w-200 max-h-150 mx-auto relative">
      <Hud leave={leave} />
      <canvas
        width={800}
        height={600}
        style={{ border: 'outset black' }}
        onClick={handleCanvasClick}
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        className="mx-auto rounded cursor-crosshair"
      />
    </div>
  );
}
