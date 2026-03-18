import { useEffect, useState } from 'react';
import type { GetGameServerInfoResponse } from '#shared/services/game';
import { apiClient } from '#shared/utils/api-client';

export const FetchComponent: React.FC = () => {
  const [data, setData] = useState<GetGameServerInfoResponse | null>(null);

  useEffect(() => {
    async function getThing() {
      const response = await apiClient.gameService.getGameServerInfo();
      setData(response);
    }
    getThing();
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
};
