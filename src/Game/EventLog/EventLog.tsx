import { useGameStore } from '#shared/stores';

export const EventLog = () => {
  const { myPlayerId, lastCombatEvent } = useGameStore();
  if (!lastCombatEvent) {
    return null;
  }
  return (
    <div className="absolute text-right right-5 top-5">
      {lastCombatEvent.attackerId === myPlayerId
        ? `Pegaste ${lastCombatEvent.damage.toFixed(1)} de daño`
        : `Recibiste ${lastCombatEvent.damage.toFixed(1)} de daño`}
    </div>
  );
};
