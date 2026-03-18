type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: object;
}

interface HttpClientConfig {
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}

export interface HttpResponse {
  data: unknown;
  url: string;
}

export function createHttpClient(config: HttpClientConfig = {}) {
  const { baseURL = '', defaultHeaders = {} } = config;

  async function request(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<HttpResponse> {
    const { method = 'GET', headers = {}, body } = options;
    const url = baseURL + endpoint;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP Error ${response.status}: ${errorText || response.statusText}`,
      );
    }

    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    return { data, url };
  }

  return {
    get: (url: string, options?: RequestOptions) =>
      request(url, { ...options, method: 'GET' }),

    post: (url: string, body?: object, options?: RequestOptions) =>
      request(url, { ...options, method: 'POST', body }),

    put: (url: string, body?: object, options?: RequestOptions) =>
      request(url, { ...options, method: 'PUT', body }),

    patch: (url: string, body?: object, options?: RequestOptions) =>
      request(url, { ...options, method: 'PATCH', body }),

    delete: (url: string, options?: RequestOptions) =>
      request(url, { ...options, method: 'DELETE' }),
  };
}
