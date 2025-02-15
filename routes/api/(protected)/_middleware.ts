import { getCookies } from "@std/http/cookie";
import { FreshContext } from "$fresh/server.ts";
import { verify } from "@zaubrik/djwt";
import { cryptoKey } from "../../../utils/secrets.ts";

export async function handler(req: Request, ctx: FreshContext) {
	const cookies = getCookies(req.headers);

	if (!cookies.token) {
		return Response.redirect(ctx.url.origin);
	}

	try {
		const payload = await verify(cookies.token, cryptoKey);

		ctx.state = { ...payload };
		return ctx.next();
	} catch (err) {
		console.log(err);

		return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 }) 
	}
}
