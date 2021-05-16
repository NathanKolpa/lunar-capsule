import { NetworkClient } from "./NetworkClient";

export interface NetworkServer {
    onClientConnect(callback: (client: NetworkClient) => void): void;
}