export interface GeminiRequest {
	readonly fullUrl: string;
	readonly host: string;
	readonly port: number;
	readonly path: string;
	readonly params: { [key:string]: string };
	readonly fragment: string;
	readonly input?: string;
}

export interface GeminiSuccessBuilder {
	sendString(body: string): GeminiSuccessBuilder;
	close(): void;
}

export type GeminiFailureScope = 'temporary' | 'permanent';

export interface GeminiResponseBuilder {
	fail(scope: GeminiFailureScope, message: string): void;
	succeed(mimeType: string): GeminiSuccessBuilder;
}

export type RequestHandler = (req: GeminiRequest, res: GeminiResponseBuilder) => void;
