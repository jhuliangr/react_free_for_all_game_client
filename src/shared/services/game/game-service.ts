import { BaseService } from '../base-service';
import {
  GetGameServerInfoResponseSchema,
  type GetGameServerInfoResponse,
} from './schemas';

export class GameService extends BaseService {
  public async getGameServerInfo(): Promise<GetGameServerInfoResponse> {
    return this.httpClient
      .get('/api/config')
      .then(this.validateResponse(GetGameServerInfoResponseSchema));
  }
}
