import { GeminiRequest, RequestHandler } from './handling';

export interface EndpointConfig {
  path?: string;
  host?: string;
  query?: { [key: string]: string };
}

export interface RouteResult {
  params: { [key: string]: string };
  handler: RequestHandler;
}

export type Router = {
  endpoint(config: EndpointConfig, handler: RequestHandler): void;
  default(handler: RequestHandler): void;
  child(config: EndpointConfig, router: Router): void;

  getHandler(req: GeminiRequest): RouteResult;
};
