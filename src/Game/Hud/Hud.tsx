import { Button } from '#shared/components';
import { useGameStore } from '#shared/stores';
import { EventLog } from './EventLog';
import { LifeAndXpIndicator } from './LifeAndXpIndicator';

type Props = {
  leave: () => void;
};

export const Hud: React.FC<Props> = ({ leave }) => {
  const { myPlayerId, players } = useGameStore();
  const me = myPlayerId ? players[myPlayerId] : null;
  return (
    <div>
      <LifeAndXpIndicator />
      <EventLog />
      <p className="absolute top-1 right-5 font-light text-xs text-white">
        x:{me?.x.toFixed(2)} y:{me?.y.toFixed(2)}
      </p>
      <Button
        variant="secondary"
        className="absolute max-w-fit right-0 bottom-0"
        onClick={() => leave()}
      >
        Disconnect
      </Button>
    </div>
  );
};
