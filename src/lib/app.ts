import { Router } from './routing';

export interface AppInstance {
	readonly  port: number;

	stop(): Promise<void>;
}

export interface App {

	readonly router: Router;

	listen(port: number): Promise<AppInstance>;

}
