import type { createHttpClient } from './createHttpClient';

export type HttpClient = ReturnType<typeof createHttpClient>;

export type ServiceConfig = {
  httpClient: HttpClient;
};
