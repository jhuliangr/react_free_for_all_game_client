import { Button, Box } from '#shared/components';
import { useSettingsStore } from '#shared/stores';
import { cn } from '#shared/utils';
import { Link } from 'react-router';

const CONDITION_LABELS: Record<string, string> = {
  kills: 'Kills',
  level: 'Level',
};

export const Achievements: React.FC = () => {
  const achievements = useSettingsStore((s) => s.achievements);
  const unlockedIds = useSettingsStore((s) => s.unlockedAchievementIds);

  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-5">
      <title>Achievements | Game</title>

      <div className="flex items-center gap-4">
        <Link to="/">
          <Button>Back</Button>
        </Link>
        <h1 className="text-primary font-bold text-3xl">Achievements</h1>
        <span className="text-white/50 text-sm">
          {unlockedIds.length}/{achievements.length}
        </span>
      </div>

      <Box>
        {achievements.length === 0 ? (
          <p className="text-white/50 text-center py-4">
            No achievements available
          </p>
        ) : (
          <div className="flex flex-col gap-2 min-w-[320px]">
            {achievements.map((ach) => {
              const unlocked = unlockedIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border-2 transition-colors',
                    {
                      'border-primary/60 bg-primary/10': unlocked,
                      'border-white/10 bg-white/5 opacity-60': !unlocked,
                    },
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0',
                      {
                        'bg-primary text-white': unlocked,
                        'bg-white/10 text-white/30': !unlocked,
                      },
                    )}
                  >
                    {unlocked ? '\u2713' : '?'}
                  </div>

                  <div className="flex-1">
                    <div
                      className={cn('font-bold', {
                        'text-white': unlocked,
                        'text-white/50': !unlocked,
                      })}
                    >
                      {ach.name}
                    </div>
                    <div className="text-xs text-white/40">
                      {CONDITION_LABELS[ach.condition.type] ??
                        ach.condition.type}
                      : {ach.condition.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Box>
    </div>
  );
};
