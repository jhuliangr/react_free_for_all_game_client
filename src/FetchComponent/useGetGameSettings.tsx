import type { GetGameServerInfoResponse } from '#shared/services/game';
import { apiClient } from '#shared/utils/api-client';
import { useEffect, useState } from 'react';

export function useGetGameSettings() {
  const [data, setData] = useState<GetGameServerInfoResponse | null>(null);
  useEffect(() => {
    async function getThing() {
      const response = await apiClient.gameService.getGameServerInfo();
      setData(response);
    }
    getThing();
  }, []);
  return data;
}
