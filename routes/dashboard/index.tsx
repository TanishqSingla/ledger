import { Handlers, LayoutConfig } from "$fresh/server.ts";
import { getCookies } from "jsr:@std/http@^1.0.3/cookie";
import { cryptoKey } from "../../utils/secrets.ts";
import { verify } from "@zaubrik/djwt";

export const config: LayoutConfig = {
	skipInheritedLayouts: true,
};

export const handler: Handlers = {
	async GET(req, ctx) {
		const cookies = getCookies(req.headers);

		if (!cookies.token) {
			return Response.redirect(ctx.url.origin);
		}

		try {
			await verify(cookies.token, cryptoKey);

			return ctx.render();
		} catch (err) {
			console.log(err);

			return Response.redirect(ctx.url.origin);
		}
	},
};

export default function Dashboard() {
	return <section>Hello Dashboard!</section>;
}
