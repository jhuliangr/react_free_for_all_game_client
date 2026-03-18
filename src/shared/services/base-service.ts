import {
  type ServiceConfig,
  type HttpClient,
  type validateResponse,
  responseValidatorFactory,
} from '#shared/utils';

export class BaseService {
  public httpClient: HttpClient;
  public validateResponse: typeof validateResponse;

  constructor(config: ServiceConfig) {
    this.httpClient = config.httpClient;
    this.validateResponse = responseValidatorFactory();
  }
}
