import { getCookies } from "@std/http/cookie";
import { FreshContext } from "fresh";
import { verify } from "@zaubrik/djwt";
import { cryptoKey } from "@utils/secrets.ts";

export async function handler(ctx: FreshContext<Record<string, unknown>>) {
	const req = ctx.req;
	const cookies = getCookies(req.headers);

	if (!cookies.token) {
		return Response.redirect(ctx.url.origin);
	}

	try {
		const payload = await verify(cookies.token, cryptoKey);

		Object.assign(ctx.state, { ...payload });
		return ctx.next();
	} catch (err) {
		console.log(err);

		return new Response(JSON.stringify({ error: "unauthorized" }), {
			status: 401,
		});
	}
}
