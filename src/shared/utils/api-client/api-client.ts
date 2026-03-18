import { GameService } from '#shared/services/game';
import type { ServiceConfig } from '#shared/utils';
import { createHttpClient } from '../createHttpClient';
import type { HttpClient } from '../types';

export class ApiClient {
  private readonly httpClient: HttpClient;
  public baseUrl: string;

  public gameService: GameService;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SERVER_LINK;
    this.httpClient = createHttpClient({ baseURL: this.baseUrl });

    const serviceConfig: ServiceConfig = {
      httpClient: this.httpClient,
    };

    this.gameService = new GameService(serviceConfig);
  }
}
