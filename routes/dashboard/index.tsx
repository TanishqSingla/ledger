import { Handlers, LayoutConfig } from "$fresh/server.ts";
import { getCookies } from "jsr:@std/http@^1.0.3/cookie";
import { cryptoKey } from "../../utils/secrets.ts";
import { verify } from "@zaubrik/djwt";

export const config: LayoutConfig = {
	skipInheritedLayouts: true,
};

export const handler: Handlers = {
	async GET(req, ctx) {
		const data = {
			email_id: ctx.state.email_id
		};

		try {
			await verify(cookies.token, cryptoKey);

			return ctx.render();
		} catch (err) {
			console.log(err);

			return Response.redirect(ctx.url.origin);
		}
		return ctx.render(data);
	},
};

export default function Dashboard() {
	return <section>Hello Dashboard!</section>;
}
