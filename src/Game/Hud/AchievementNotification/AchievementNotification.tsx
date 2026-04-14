import type { Achivement } from '#shared/services/game';
import { useEffect } from 'react';

type Props = {
  achievement: Achivement;
  onDismiss: () => void;
};

export const AchievementNotification: React.FC<Props> = ({
  achievement,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievement.id]);

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-primary/90 border-2 border-primary text-white px-5 py-3 rounded-lg shadow-lg text-center">
        <div className="text-xs uppercase tracking-wider text-white/70">
          Achievement Unlocked
        </div>
        <div className="font-bold text-lg">{achievement.name}</div>
      </div>
    </div>
  );
};
