import type { Achivement } from '#shared/services/game';
import { Toast } from '#shared/components';

type Props = {
  achievement: Achivement;
  onDismiss: () => void;
};

export const AchievementNotification: React.FC<Props> = ({
  achievement,
  onDismiss,
}) => {
  return (
    <Toast
      title="Achievement Unlocked"
      message={achievement.name}
      onDismiss={onDismiss}
      key={achievement.id}
    />
  );
};
