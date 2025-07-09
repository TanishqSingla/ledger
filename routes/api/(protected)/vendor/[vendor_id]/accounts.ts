import { Handlers } from "$fresh/server.ts";
import { vendors } from "@repositories/repos.ts";

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const vendor_id = ctx.params.vendor_id;

		try {
			const resp = await vendors.GetAccounts(vendor_id);

			return Response.json(resp);
		} catch (err: any) {
			console.log(err);
			return Response.json({ status: "error", message: err.message }, {
				status: 500,
			});
		}
	},
	POST: async function (req, ctx) {
		const payload = await req.json();
		const vendor_id = ctx.params.vendor_id;

		try {
			const resp = await vendors.AddAccount(vendor_id, payload);

			return new Response(JSON.stringify(resp), { status: 200 });
		} catch (err: any) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
	},

	DELETE: async function (req, ctx) {
		const payload = await req.json();
		const vendor_id = ctx.params.vendor_id;

		try {
			const resp = await vendors.DeleteAccount(vendor_id, payload.accountId);

			return new Response(JSON.stringify(resp), { status: 200 });
		} catch (err: any) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
	},
};
