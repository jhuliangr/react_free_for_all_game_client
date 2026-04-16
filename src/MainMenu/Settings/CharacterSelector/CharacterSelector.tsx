import { useSettingsStore } from '#shared/stores';
import { cn } from '#shared/utils';

export const CharacterSelector: React.FC = () => {
  const characters = useSettingsStore((s) => s.characters);
  const selectedCharacter = useSettingsStore((s) => s.selectedCharacter);
  const setSelectedCharacter = useSettingsStore((s) => s.setSelectedCharacter);

  return (
    <div className="flex md:justify-around justify-center flex-wrap gap-3 ">
      {characters.map((char) => {
        const isSelected = selectedCharacter === char.id;
        const stats = char.stats;
        if (!stats) return null;

        return (
          <div
            className={cn(
              'border-2 p-3 rounded-lg cursor-pointer select-none min-w-30 text-center transition-colors',
              {
                'border-primary text-primary': isSelected,
                'border-white/20 text-white/70 hover:border-white/40':
                  !isSelected,
              },
            )}
            key={char.id}
            onClick={() => setSelectedCharacter(char.id)}
          >
            <div className="font-bold text-lg mb-2">{char.name}</div>
            <div className="text-xs space-y-1 text-left">
              <StatRow
                label="HP"
                value={stats.base_hp}
                max={120}
                color="text-lime-400"
              />
              <StatRow
                label="ATK"
                value={
                  stats.dot
                    ? stats.dot.damage_per_sec * stats.dot.duration_sec
                    : stats.base_damage
                }
                max={20}
                color="text-red-400"
              />
              <StatRow
                label="Range"
                value={stats.attack_range}
                max={200}
                color="text-blue-400"
              />
              <StatRow
                label="KB"
                value={stats.knockback_distance}
                max={150}
                color="text-orange-400"
              />
              {stats.dot && (
                <div className="text-purple-400 font-semibold">
                  DoT: {stats.dot.damage_per_sec}/s x {stats.dot.duration_sec}s
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function StatRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-1">
      <span className="w-10 text-white/60">{label}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`w-6 text-right ${color}`}>{value}</span>
    </div>
  );
}
