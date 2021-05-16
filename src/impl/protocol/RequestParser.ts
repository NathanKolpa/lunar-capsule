import { URL } from 'url';
import * as util from 'util';
import { DEFAULT_GEMINI_PORT } from '../../constants';

const CR = 0x0D;
const LF = 0x0A;

export interface RawRequest {
	hostname: string,
	port: number,
	pathname: string,
	query: { [key: string]: string },
}

export class RequestParser {

	private errMsg?: string;
	private complete = false;
	private url: Uint8Array = new Uint8Array();
	private isExpectingLf = false;
	private rawRequest: RawRequest | undefined;

	public get isComplete(): boolean {
		return this.complete && !this.errMsg;
	}

	public get hasError(): boolean {
		return !!this.errMsg;
	}

	public get errorMessage(): string | undefined {
		return this.errMsg;
	}

	public getRequest(): RawRequest | undefined {
		return this.rawRequest;
	}

	public addBuffer(binaryBuffer: Uint8Array): void {
		for (let i = 0; i < binaryBuffer.length; i++) {
			if (this.complete) {
				this.errMsg = "Unexpected byte(s) after CRLF termination";
				break;
			}

			if (this.errMsg) {
				break;
			}

			this.addByte(binaryBuffer[i]);
		}
	}

	private addByte(byte: number): void {

		if (byte === LF) {
			if (this.isExpectingLf) {
				this.complete = true;
				// parse the URL
				let urlStr = decodeURI(new util.TextDecoder().decode(this.url));

				try {
					let urlObj = new URL(urlStr);

					if (urlObj.hostname == null || +(urlObj.port ?? 0) == NaN) {
						this.errMsg = 'Invalid URL';
					}
					else {
						this.rawRequest = {
							hostname: urlObj.hostname,
							port: +(urlObj.port ?? DEFAULT_GEMINI_PORT),
							pathname: urlObj.pathname ?? '/',
							query: urlObj.searchParams.entries() as any
						};
					}
				}
				catch (e) {
					if (e instanceof TypeError) {
						this.errMsg = 'Could not parse URL';
					}
					else {
						throw e;
					}
				}
			}
			else {
				this.errMsg = "Unexpected LF character";
			}
		}
		else if (this.isExpectingLf) {
			this.errMsg = "Expected LF character found: " + byte;
		}
		else if (byte === CR) {
			this.isExpectingLf = true;
		}
		else {
			// TODO: this can be much faster
			let newUrl = new Uint8Array(this.url.length + 1);

			for (let i = 0; i < this.url.length; i++) {
				newUrl[i] = this.url[i];
			}

			newUrl[newUrl.length - 1] = byte;

			this.url = newUrl;
		}
	}
}
