import { NetworkServer } from "../networking/NetworkServer";
import { FullGeminiRequest } from "./FullGeminiRequest";
import { GeminiClient } from "./GeminiClient";
import { RawRequest } from "./RequestParser";

export class GeminiServer {
    public constructor(private _server: NetworkServer) { }

    public onGeminiRequest(callback: (req: FullGeminiRequest) => void) {
        this._server.onClientConnect(async (client) => {
            let geminiClient = new GeminiClient(client);

            let rawRequest!: RawRequest;
            try {
                rawRequest = await geminiClient.getRequest();
            }
            catch (err) {
                if (!client.isClosed) {
                    await geminiClient.sendHeader(59, err);
                    await geminiClient.close();
                }
                return;
            }

            callback(new FullGeminiRequest(rawRequest, geminiClient));
        })
    }
}