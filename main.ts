import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";
import "$std/dotenv/load.ts";

export const app = new App().use(staticFiles()).use(trailingSlashes("never"));

await fsRoutes(app, {
	loadIsland: (path) => import(`./islands/${path}`),
	loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
	await app.listen();
}
