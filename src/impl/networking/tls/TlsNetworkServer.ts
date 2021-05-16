// https://github.com/derhuerst/gemini/blob/master/server.js used as reference. Big up!

import * as tls from 'tls';
import { NetworkServer } from '../NetworkServer';
import { TlsNetworkClient } from './TlsNetworkClient';

const MIN_TLS_VERSION = 'TLSv1.2';

export class TlsNetworkServer implements NetworkServer {

	public static fromCert(port: number, privateKey: string, publicCert: string): TlsNetworkServer {
		const server = tls.createServer({ minVersion: MIN_TLS_VERSION, rejectUnauthorized: false, requestCert: true, key: privateKey, cert: publicCert });
		server.on('error', () => {})

		return new TlsNetworkServer(port, server);
	}

	public constructor(public readonly port: number, private sever: tls.Server) {
	}

	public onClientConnect(callback: (client: TlsNetworkClient) => void): void {
		this.sever.on('secureConnection', (socket) => {

			socket.on('error', () => {});

			// return on error, but allow self signed certs
			if (socket.authorizationError
				&& socket.authorizationError as unknown as string != 'SELF_SIGNED_CERT_IN_CHAIN'
				&& socket.authorizationError as unknown as string != 'DEPTH_ZERO_SELF_SIGNED_CERT'
				&& socket.authorizationError as unknown as string != 'UNABLE_TO_GET_ISSUER_CERT') {
				socket.destroy(new Error(socket.authorizationError as unknown as string));
				return;
			}

			callback(new TlsNetworkClient(socket));
		})
	}

	public start(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.sever.listen(this.port, () => {
				resolve();
			});
		})
	}

	public stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.sever.close((err) => {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			})
		});
	}
}
