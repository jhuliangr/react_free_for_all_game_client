import { useGameStore } from '#shared/stores';

export const EventLog = () => {
  const { myPlayerId, lastCombatEvent } = useGameStore();
  if (!lastCombatEvent) {
    return null;
  }

  const isDot = lastCombatEvent.attackerId === 'dot';
  const isMyAttack = lastCombatEvent.attackerId === myPlayerId;
  const isMyDefense = lastCombatEvent.defenderId === myPlayerId;

  let text: string;
  let colorClass: string;

  if (isDot && isMyDefense) {
    text = `DoT -${lastCombatEvent.damage.toFixed(1)} HP`;
    colorClass = 'text-purple-400';
  } else if (isDot) {
    text = `DoT on enemy -${lastCombatEvent.damage.toFixed(1)}`;
    colorClass = 'text-purple-300';
  } else if (isMyAttack) {
    text = `Hit ${lastCombatEvent.damage.toFixed(1)} damage`;
    colorClass = 'text-white';
  } else if (isMyDefense) {
    text = `Received ${lastCombatEvent.damage.toFixed(1)} damage`;
    colorClass = 'text-red-400';
  } else {
    return null;
  }

  return (
    <div className={`absolute text-right right-5 top-5 ${colorClass}`}>
      {text}
    </div>
  );
};
