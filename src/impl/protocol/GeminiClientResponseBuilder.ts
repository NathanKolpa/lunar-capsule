import { GeminiInputSensitivity, GeminiRedirectType, GeminiResponseBuilder, GeminiSuccessBuilder } from "../../handling";
import { GeminiClient } from "./GeminiClient";

class GeminiClientSuccessBuilder implements GeminiSuccessBuilder {

    private lastPromise: Promise<any> | undefined;
    private hasSendHeader: boolean = false;

    public constructor(private mineType: string, private client: GeminiClient) { }

    sendString(body: string): GeminiSuccessBuilder {
        if (!this.hasSendHeader) {
            this.appendTask(() => this.client.sendHeader(20, this.mineType));
            this.hasSendHeader = true;
        }

        this.appendTask(() => this.client.sendConent(body));
        return this;
    }

    close(): void {
        this.appendTask(() => this.client.close());
    }

    appendTask(callback: () => Promise<any>) {
        if (this.lastPromise) {
            this.lastPromise.then(() => callback());
        }
        else {
            this.lastPromise = callback();
        }
    }
}

export class GeminiClientResponseBuilder implements GeminiResponseBuilder {

    public constructor(private client: GeminiClient) { }

    succeed(mimeType: string): GeminiSuccessBuilder {
        return new GeminiClientSuccessBuilder(mimeType, this.client);
    }

    private headerResponse(status: number, meta?: string): void {
    	this.client.sendHeader(status, meta).then(() => this.client.close());
	 }

    input(name: string, sensitivity: GeminiInputSensitivity = 'insensitive'): void {
        if (sensitivity == 'sensitive') {
            this.headerResponse(11, name);
        }
        else if (sensitivity == 'insensitive') {
            this.headerResponse(10, name);
        }
    }

    redirect(location: string, type: GeminiRedirectType = 'temporary'): void {
        if (type == 'permanent') {
            this.headerResponse(30, location);
        }
        else if (type == 'temporary') {
            this.headerResponse(31, location);
        }
    }

    temporaryFailure(msg?: string): void {
        this.headerResponse(40, msg ?? '');
    }

    serverUnavailable(msg?: string): void {
        this.headerResponse(41, msg ?? '');
    }

    cgiError(msg?: string): void {
        this.headerResponse(42, msg ?? '');
    }

    proxyError(msg?: string): void {
        this.headerResponse(43, msg ?? '');

    }

    slowDown(msg?: string): void {
        this.headerResponse(44, msg ?? '');
    }

    permanentFailure(msg?: string): void {
        this.headerResponse(50, msg ?? '');
    }

    notFound(msg?: string): void {
        this.headerResponse(51, msg ?? '');
    }

    gone(msg?: string): void {
        this.headerResponse(52, msg ?? '');
    }

    proxyRequestRefused(msg?: string): void {
        this.headerResponse(53, msg ?? '');
    }

    malformedRequest(msg?: string): void {
        this.headerResponse(59, msg ?? '');
    }

    unauthenticated(msg?: string): void {
        this.headerResponse(60, msg ?? '');
    }

    unauthorized(msg?: string): void {
        this.headerResponse(61, msg ?? '');
    }

    clientCertNotValid(msg?: string): void {
        this.headerResponse(62, msg ?? '');
    }

}
