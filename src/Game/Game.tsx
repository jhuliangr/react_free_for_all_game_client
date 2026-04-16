import { useRef } from 'react';
import { useGameStore } from '#shared/stores';
import { JoinGameForm } from './JoinGameForm';
import { Hud } from './Hud';
import { Joystick } from './Joystick';
import {
  useAttackAnimation,
  useBackgroundImage,
  useCanvasRenderer,
  useDeathDetection,
  useIsMobile,
  useKeyboardMapping,
  useMobileControls,
  useOtherPlayersAttacks,
  usePlayerSprite,
  useSocketSubscribe,
  useSoundEffects,
} from './hooks';

export function Game() {
  const {
    joined,
    reconnecting,
    join,
    lost,
    leave,
    lastUnlockedAchievement,
    clearAchievementNotification,
  } = useSocketSubscribe();

  const isMobile = useIsMobile();

  useKeyboardMapping(joined && !isMobile);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { myPlayerId, players } = useGameStore();
  const me = myPlayerId ? players[myPlayerId] : null;

  const spriteRef = usePlayerSprite();
  const bgImageRef = useBackgroundImage();
  const activeAttacksRef = useOtherPlayersAttacks(myPlayerId);
  const { playAttackSound } = useSoundEffects();

  const desktopAttack = useAttackAnimation(
    isMobile ? undefined : playAttackSound,
  );

  const mobileControls = useMobileControls(joined && isMobile);

  const attackFlashRef = isMobile
    ? mobileControls.attackFlashRef
    : desktopAttack.attackFlashRef;
  const cooldownActiveRef = isMobile
    ? mobileControls.cooldownActiveRef
    : desktopAttack.cooldownActiveRef;

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
    <div
      className="relative mx-auto"
      style={
        isMobile
          ? { width: '100vw', height: '100dvh', overflow: 'hidden' }
          : { maxWidth: '800px', maxHeight: '600px' }
      }
    >
      <Hud
        leave={leave}
        cooldownActiveRef={cooldownActiveRef}
        lastUnlockedAchievement={lastUnlockedAchievement}
        onDismissAchievement={clearAchievementNotification}
      />
      <canvas
        width={800}
        height={600}
        style={
          isMobile
            ? {
                border: 'outset black',
                height: '100%',
                objectFit: 'contain',
                touchAction: 'none',
              }
            : { border: 'outset black' }
        }
        onClick={isMobile ? undefined : desktopAttack.handleCanvasClick}
        ref={canvasRef}
        onContextMenu={(e) => e.preventDefault()}
        className={`mx-auto rounded ${isMobile ? '' : 'cursor-crosshair'}`}
      />
      {isMobile && (
        <>
          <Joystick side="left" onMove={mobileControls.onMoveJoystick} />
          <Joystick
            side="right"
            onMove={mobileControls.onAttackJoystick}
            onEnd={mobileControls.onAttackEnd}
          />
        </>
      )}
    </div>
  );
}
