export interface NetworkClient {
    readonly isClosed: boolean;
    readonly certFingerprint: string | undefined

    close(): Promise<void>;

    onData(callback: (chunk: Uint8Array) => void): void;
    offData(allback: (chunk: Uint8Array) => void): void;

    onClose(callback: () => void): void;
    offClose(callback: () => void): void;

    send(value: string | Uint8Array): Promise<void>;
}