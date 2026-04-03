import { useGameStore } from '#shared/stores';

export const EventLog = () => {
  const { myPlayerId, lastCombatEvent } = useGameStore();
  if (!lastCombatEvent) {
    return null;
  }
  return (
    <div className="absolute text-right right-5 top-5 text-white">
      {lastCombatEvent.attackerId === myPlayerId
        ? `Hit ${lastCombatEvent.damage.toFixed(1)} damage`
        : `Received ${lastCombatEvent.damage.toFixed(1)} damage`}
    </div>
  );
};
