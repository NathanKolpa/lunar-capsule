import {GeminiRequest, RequestHandler} from "../..";
import {EndpointConfig, Router, RouteResult} from "../../routing";
import {MatchResult, matchRouteProperty} from "./matchRouteProperty";

interface Endpoint {
	config: EndpointConfig,
	handlerGetter: (req: GeminiRequest) => RouteResult;
}

interface EndpointRoutingData {
	endpoint: Endpoint;
	matchResult: MatchResult;
}

export class SimpleRouter implements Router {

	private endpoints: Endpoint[] = [];
	private defaultHandler: RequestHandler = (_req, res) => res.notFound();

	endpoint(config: EndpointConfig, handler: RequestHandler): void {
		this.endpoints.push({
			config,
			handlerGetter: () => {
				return {handler, params: {}}
			}
		});
	}

	child(config: EndpointConfig, router: Router): void {
		this.endpoints.push({
			config,
			handlerGetter: (req) => router.getHandler(req)
		});
	}

	default(handler: RequestHandler): void {
		this.defaultHandler = handler;
	}

	private static filterRouteOnProperty(input: EndpointRoutingData[], getter: (input: EndpointRoutingData) => string | undefined, prop: string): EndpointRoutingData[] {
		let result: EndpointRoutingData[] = [];

		input.forEach((input) => {
			const inputProp = getter(input);

			if(!inputProp) {
				result.push({
					endpoint: input.endpoint,
					matchResult: input.matchResult
				});

				return;
			}

			const matchResult = matchRouteProperty(inputProp, prop);

			if (matchResult.matches) {
				result.unshift({
					endpoint: input.endpoint,
					matchResult: { ...matchResult.parameters,  ...input.matchResult }
				})
			}
		})

		return result;
	}

	getHandler(req: GeminiRequest): RouteResult {

		let endpoints: EndpointRoutingData[] = this.endpoints.map(x => ({ endpoint: x, matchResult: { parameters: {}, matches: true } }));
		endpoints = SimpleRouter.filterRouteOnProperty(endpoints, (x) => x.endpoint.config.path, req.path);
		endpoints = SimpleRouter.filterRouteOnProperty(endpoints, (x) => x.endpoint.config.host, req.path);

		if (endpoints.length > 0) {
			let endpoint = endpoints[0];
			let childResult = endpoint.endpoint.handlerGetter(req);
			return {
				params: {...endpoint.matchResult.parameters, ...childResult.params},
				handler: childResult.handler
			}
		}

		return {handler: this.defaultHandler, params: {}};
	}
}
