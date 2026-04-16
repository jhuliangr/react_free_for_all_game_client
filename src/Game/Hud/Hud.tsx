import { Button } from '#shared/components';
import type { Achivement } from '#shared/services/game';
import { useGameStore } from '#shared/stores';
import { AchievementNotification } from './AchievementNotification';
import { CooldownIndicator } from './CooldownIndicator';
import { EventLog } from './EventLog';
import { LifeAndXpIndicator } from './LifeAndXpIndicator';

type Props = {
  leave: () => void;
  cooldownActiveRef: React.RefObject<boolean>;
  lastUnlockedAchievement: Achivement | null;
  onDismissAchievement: () => void;
};

export const Hud: React.FC<Props> = ({
  leave,
  cooldownActiveRef,
  lastUnlockedAchievement,
  onDismissAchievement,
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
        className="absolute max-w-fit right-0 md:bottom-0"
        onClick={() => leave()}
      >
        Disconnect
      </Button>
    </div>
  );
};
