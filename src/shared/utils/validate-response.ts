import type { ZodError, ZodType } from 'zod';

export interface ValidateResponseOptions {
  debug?: boolean;
}

function formatError(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
}

/**
 * Validates a response against a given schema
 *
 * @example
 * const validateResponse = validateResponse(GetSitesResponseSchema);
 * const response = await validateResponse(response);
 *
 * @param schema - The schema to validate the response against
 * @param options - The options for the validation
 */
export const validateResponse =
  <T>(
    schema: ZodType<T>,
    options?: ValidateResponseOptions,
  ): ((response: { data: unknown; url: string }) => T) =>
  (response: { data: unknown; url: string }) => {
    const result = schema.safeParse(response.data);

    if (result.error) {
      // Take proper action here (e.g send to Sentry)

      if (options?.debug) {
        // Format the error showing messages and api url
        // biome-ignore lint/suspicious/noConsole: this only displays when debug is true
        console.log(
          '[Validation Error] - URL: ',
          response.url,
          '\n',
          formatError(result.error),
        );
      }
    }

    return result.data ?? (response.data as T);
  };

/**
 * Factory function to create a response validator with given options
 *
 * @example
 * const validateResponse = responseValidatorFactory({ debug: true });
 * const response = await validateResponse(GetSitesResponseSchema)(response);
 * const response = await validateResponse(GetSitesObservedObjectTypesResponseSchema)(response);
 *
 * @param options - The options for the response validator
 * @returns A function that validates a response against a given schema
 */
export const responseValidatorFactory = (
  options?: ValidateResponseOptions,
): typeof validateResponse => {
  return <T>(schema: ZodType<T>) => validateResponse(schema, options);
};
