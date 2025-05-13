import { FreshContext } from "$fresh/server.ts";
import { KV_KEYS } from "@utils/constants.ts";
import { kv } from "@utils/db.ts";

export function handler(req: Request, ctx: FreshContext) {
	if (!(req.method === "GET")) {
		console.log("[Cache]: Invalidated", KV_KEYS.VENDORS);
		kv.delete([KV_KEYS.VENDORS]);
	}

	return ctx.next();
}
