import { Router } from './routing';

/**
 * Represents an application instance.
 * */
export interface AppInstance {

	/**
	 * Stop listening on the specified port.
	 * */
	stop(): Promise<void>;

	/**
	 * The port the app listens on.
	 * */
	readonly port: number;
}

/**
 * The launch options
 * */
export interface LaunchOptions {

	/**
	 * The port to listen on.
	 * When not defined, it will default to 1965
	 * */
	port?: number;

	/**
	 * The SSL certificate string.
	 * */
	cert: string,

	/**
	 * The SSL private key string
	 * **/
	key: string,

	/**
	 * The passphrase for the SSL certificate
	 * */
	passphrase?: string
}

/**
 * Represents an application
 * */
export interface App {

	/**
	 * The root router for the application.
	 *
	 * To s
	 * */
  readonly router: Router;

  /**
	* Starts the app.
	* The promise is resolved after the app has started
	*
	* @param opts The launch options
	* */
  launch(opts: LaunchOptions): Promise<AppInstance>;
}
