import { BaseService } from '../base-service';
import {
  GetGameServerInfoResponseSchema,
  GetMatchPlayersResponseSchema,
  type GetGameServerInfoResponse,
  type GetMatchPlayersResponse,
} from './schemas';

export class GameService extends BaseService {
  public async getGameServerInfo(): Promise<GetGameServerInfoResponse> {
    return this.httpClient
      .get('/api/config')
      .then(this.validateResponse(GetGameServerInfoResponseSchema));
  }

  public async getMatchPlayers(
    limit: number,
  ): Promise<GetMatchPlayersResponse> {
    return this.httpClient
      .get(`/api/match/players?limit=${encodeURIComponent(limit)}`)
      .then(this.validateResponse(GetMatchPlayersResponseSchema));
  }
}
