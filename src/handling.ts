export interface GeminiRequest {
  readonly hostname: string;
  readonly input: string | undefined;
  readonly path: string;
  readonly domain: string;
  readonly query: { [key: string]: string };
  readonly routeParams: { [key: string]: string };
}

export interface GeminiSuccessBuilder {
  sendString(body: string): GeminiSuccessBuilder;
  close(): void;
}

export type GeminiInputSensitivity
  = 'insensitive'
  | 'sensitive';

export type GeminiRedirectType
  = 'temporary'
  | 'permanent';

export interface GeminiResponseBuilder {
  succeed(mimeType: string): GeminiSuccessBuilder;
  input(name: string, sensitivity: GeminiInputSensitivity): void;
  redirect(location: string, type?: GeminiRedirectType): void;

  temporaryFailure(msg?: string): void;
  serverUnavailable(msg?: string): void;
  cgiError(msg?: string): void;
  proxyError(msg?: string): void;
  slowDown(msg?: string): void;
  permanentFailure(msg?: string): void;
  notFound(msg?: string): void;
  gone(msg?: string): void;
  proxyRequestRefused(msg?: string): void;
  malformedRequest(msg?: string): void;

  unauthenticated(msg?: string): void;
  unauthorized(msg?: string): void;
  clientCertNotValid(msg?: string): void;
}

/**
 * This callback should handle a request.
 *
 * Make sure a response is send because otherwise, the connection will remain open causing a leak.
 * */
export type RequestHandler = (
  req: GeminiRequest,
  res: GeminiResponseBuilder
) => void;
