import { AppInstance } from "../app";
import { TlsNetworkServer } from "./networking/tls/TlsNetworkServer";

export class LiveAppInstance implements AppInstance {

	public constructor(private server: TlsNetworkServer) { }

	stop(): Promise<void> {
		return this.server.stop();
	}

	public get port(): number {
		return this.server.port;
	}
}
