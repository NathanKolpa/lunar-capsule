import {DEFAULT_GEMINI_PORT} from "../constants";
import {App, AppInstance, LaunchOptions} from "../app";
import {Router} from "../routing";
import {LiveAppInstance} from "./LiveAppInstance";
import {TlsNetworkServer} from "./networking/tls/TlsNetworkServer";
import {GeminiClientResponseBuilder} from "./protocol/GeminiClientResponseBuilder";
import {GeminiServer} from "./protocol/GeminiServer";
import {SimpleRouter} from "./routing/SimpleRouter";

export class LiveApp implements App {


	private simpleRouter = new SimpleRouter();

	public get router(): Router {
		return this.simpleRouter;
	}

	async launch(opts: LaunchOptions): Promise<AppInstance> {

		const port = opts.port ?? DEFAULT_GEMINI_PORT;
		const server = TlsNetworkServer.fromCert(port, opts.key, opts.cert);

		{
			const geminiServer = new GeminiServer(server);

			geminiServer.onGeminiRequest((req) => {
				const {handler, params} = this.router.getHandler(req);
				const res = new GeminiClientResponseBuilder(req.client);
				req.routeParams = params;

				handler(req, res);
			});
		}

		await server.start();

		return new LiveAppInstance(server);
	}
}
