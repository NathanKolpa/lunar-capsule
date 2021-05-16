import { NetworkClient } from '../networking/NetworkClient';
import { RawRequest, RequestParser } from './RequestParser';

export class GeminiClient {
    public constructor(private _client: NetworkClient) { }

    public getRequest(): Promise<RawRequest> {
        return new Promise((resolve, reject) => {

            const parser = new RequestParser();

            let removeCallbacks!: () => void;

            const onDataCallback = async (chunk: Uint8Array) => {

                parser.addBuffer(chunk);

                if (parser.hasError || parser.isComplete) {

                    if (parser.hasError) {
                        reject(parser.errorMessage);
                    }
                    else if (parser.isComplete) {
                        resolve(parser.getRequest()!);
                    }

                    removeCallbacks();
                }

            };

            const onCloseCallback = () => {
                removeCallbacks();
                reject('The client closed');
            };

            removeCallbacks = () => {
                this._client.offClose(onCloseCallback);
                this._client.offData(onDataCallback);
            }

            this._client.onData(onDataCallback);
            this._client.onClose(onCloseCallback);

        });
    }

    public async sendHeader(status: number, meta?: string): Promise<void> {
        let metaStr = meta ?? '';

        await this._client.send(`${status} ${metaStr}` + "\r\n");
    }

    public sendConent(content: string): Promise<void> {
        return this._client.send(content);
    }

    public async close(): Promise<void> {
        return this._client.close();
    }
}