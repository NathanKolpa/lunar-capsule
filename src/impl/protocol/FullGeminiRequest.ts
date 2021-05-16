import { GeminiRequest } from "../..";
import { GeminiClient } from "./GeminiClient";
import { RawRequest } from "./RequestParser";

export class FullGeminiRequest implements GeminiRequest {

	private privRouteParams: { [key: string]: string } = {};

	public constructor(private raw: RawRequest, public readonly client: GeminiClient) { }

	public get routeParams(): { [key: string]: string; } {
		return this.privRouteParams;
	}

	public set routeParams(value: { [key: string]: string; }) {
		this.privRouteParams = value;
	}

	public get hostname(): string {
		return this.raw.hostname;
	}

	public get path(): string {
		return this.raw.pathname;
	}

	public get query(): { [key: string]: string } {
		return this.raw.query;
	}

	public get domain(): string {
		return this.raw.hostname;
	}

	public get input(): string | undefined {

		let keys = Object.keys(this.raw.query);

		if (keys.length == 1) {
			let key = keys[0];

			if (this.raw.query[key] != '') {
				return this.raw.query[key];
			}
			else {
				return key;
			}
		}

		return undefined;
	}
}