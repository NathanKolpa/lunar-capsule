import { RequestHandler } from './handling';

export interface EndpointConfig {
	path: string,
	host?: string,
	input?: string,
	clientCertificate?: boolean
}

export interface Router {
	endpoint(config: EndpointConfig, handler: RequestHandler): void;
	child(config: EndpointConfig, router: Router): void;
}
