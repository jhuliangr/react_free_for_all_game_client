import { Button } from '#shared/components';
import type { Achivement } from '#shared/services/game';
import { useGameStore } from '#shared/stores';
import { cn } from '#shared/utils';
import { AchievementNotification } from './AchievementNotification';
import { CooldownIndicator } from './CooldownIndicator';
import { EventLog } from './EventLog';
import { LifeAndXpIndicator } from './LifeAndXpIndicator';

type Props = {
  leave: () => void;
  cooldownActiveRef: React.RefObject<boolean>;
  lastUnlockedAchievement: Achivement | null;
  onDismissAchievement: () => void;
  isMobile: boolean;
};

export const Hud: React.FC<Props> = ({
  leave,
  cooldownActiveRef,
  lastUnlockedAchievement,
  onDismissAchievement,
  isMobile,
}) => {
  const { myPlayerId, players } = useGameStore();
  const me = myPlayerId ? players[myPlayerId] : null;
  return (
    <div>
      <LifeAndXpIndicator />
      <EventLog />
      {lastUnlockedAchievement && (
        <AchievementNotification
          achievement={lastUnlockedAchievement}
          onDismiss={onDismissAchievement}
        />
      )}
      <p className="absolute top-1 right-5 font-light text-xs text-white">
        x:{me?.x.toFixed(2)} y:{me?.y.toFixed(2)}
      </p>
      <CooldownIndicator cooldownActiveRef={cooldownActiveRef} />
      <Button
        variant="secondary"
        className={cn('absolute max-w-fit', {
          'left-5 top-24': isMobile,
          'right-0 bottom-0': !isMobile,
        })}
        onClick={() => leave()}
      >
        Disconnect
      </Button>
    </div>
  );
};
