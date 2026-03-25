import { useGameStore, useSettingsStore } from '#shared/stores';
import { useRef } from 'react';
import { EventLog } from './EventLog';
import { JoinGameForm } from './JoinGameForm';
import { LifeAndXpIndicator } from './LifeAndXpIndicator';
import {
  useAttackAnimation,
  useCanvasRenderer,
  useDeathDetection,
  useKeyboardMapping,
  useOtherPlayersAttacks,
  usePlayerSprite,
  useSocketSubscribe,
  useSoundEffects,
} from './hooks';

export function Game() {
  const { joined, leave } = useSocketSubscribe();
  useKeyboardMapping(joined);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedCharacter } = useSettingsStore();
  const { myPlayerId, players } = useGameStore();
  const me = myPlayerId ? players[myPlayerId] : null;

  const spriteRef = usePlayerSprite(selectedCharacter);
  const activeAttacksRef = useOtherPlayersAttacks(myPlayerId);
  const { playSlice } = useSoundEffects();
  const { attackFlashRef, handleCanvasClick } = useAttackAnimation(playSlice);

  useDeathDetection(me, leave);
  useCanvasRenderer(canvasRef, spriteRef, attackFlashRef, activeAttacksRef);

  if (!joined) return <JoinGameForm />;

  return (
    <div className="max-w-200 max-h-150 mx-auto relative">
      <LifeAndXpIndicator />
      <EventLog />
      <p className="absolute top-1 right-5 font-light text-xs">
        x:{me?.x.toFixed(2)} y:{me?.y.toFixed(2)}
      </p>
      <canvas
        width={800}
        height={600}
        style={{ cursor: 'crosshair', border: 'solid black' }}
        onClick={handleCanvasClick}
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        className="mx-auto rounded-xl"
      />
    </div>
  );
}
