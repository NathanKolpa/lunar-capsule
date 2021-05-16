import {LiveApp} from "./impl/LiveApp";
import {SimpleRouter} from "./impl/routing/SimpleRouter";
import {App} from "./app";
import {Router} from "./routing";

/**
 * Create a new {@link App}
 * */
export function createApp(): App {
	return new LiveApp();
}

/**
 * Create a new {@link Router}
 * */
export function createRouter(): Router {
	return new SimpleRouter();
}
