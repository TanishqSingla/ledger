import { Handlers } from "$fresh/server.ts";
import { AddAccountToVendor } from "../../../../../db/Vendors.ts";

export const handler: Handlers = {
	PUT: async function (req, ctx) {
		const payload = await req.json();
		const vendor_id = ctx.params.vendor_id;

		try {
			const resp = await AddAccountToVendor(vendor_id, payload);

			return new Response(JSON.stringify(resp), { status: 200 });
		} catch (err: any) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
	},
};
