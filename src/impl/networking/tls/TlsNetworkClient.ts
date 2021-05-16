import * as tls from 'tls';
import { NetworkClient } from '../NetworkClient';

export class TlsNetworkClient implements NetworkClient {

	private streamEnded = false;
	private cert: tls.PeerCertificate | undefined;

	public get isClosed(): boolean {
		return this.streamEnded;
	}

	public constructor(private readonly socket: tls.TLSSocket) {
		this.socket.on('end', () => {
			this.streamEnded = true;
		});

		this.cert = this.socket.getPeerCertificate();
	}

	onClose(callback: () => void): void {
		this.socket.on('close', callback);
	}

	offClose(callback: () => void): void {
		this.socket.removeListener('close', callback);
	}

	offData(callback: (chunk: Uint8Array) => void): void {
		this.socket.removeListener('data', callback);
	}

	public send(value: string | Uint8Array): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if(this.socket.destroyed)
				return;

			this.socket.write(value, (err) => {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});
		});
	}

	public close(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.socket.destroy();
			resolve();
		});
	}

	public onData(callback: (chunk: Uint8Array) => void): void {
		this.socket.on('data', (chunk) => {
			callback(chunk);
		})
	}


	public get certFingerprint(): string | undefined {
		if (!this.cert || !this.cert.fingerprint) {
			return undefined;
		}

		return this.cert.fingerprint;
	}
}
