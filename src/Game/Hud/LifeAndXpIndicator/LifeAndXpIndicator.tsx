import { useGameStore } from '#shared/stores';
import { cn } from '#shared/utils';

export const LifeAndXpIndicator: React.FC = () => {
  const { myPlayerId, players } = useGameStore();
  if (!myPlayerId) {
    return null;
  }
  const me = players[myPlayerId];
  return (
    <div className="absolute text-left top-5 left-5">
      <div
        className={cn('font-bold', {
          'text-lime-400': me.hp > 25,
          'text-red-400': me.hp <= 25,
        })}
      >
        HP: {me.hp.toFixed(0)} / {me.max_hp}
      </div>
      <div className="text-teal-400 font-bold">
        Level: {me.level} — XP: {me.xp.toFixed(0)} / {xpForLevel(me.level + 1)}
      </div>
    </div>
  );
};

function xpForLevel(level: number) {
  return Math.round(100 * Math.pow(1.5, level - 1));
}
