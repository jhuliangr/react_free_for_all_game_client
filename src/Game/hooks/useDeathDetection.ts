import type { Player } from '#shared/services/websocket';
import { useEffect } from 'react';

export function useDeathDetection(me: Player | null, leave: () => void) {
  useEffect(() => {
    if (me && me.hp <= 0) leave();
  }, [me, leave]);
}
