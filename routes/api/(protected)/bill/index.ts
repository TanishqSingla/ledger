import { Handlers } from "$fresh/server.ts";
import { PutBill } from "@db/Bills.ts";

export const handler: Handlers = {
	PUT: async function (req, ctx) {
		const values = await req.json();

		const resp = await PutBill({ ...values }, ctx.state.email_id as string);

		if (resp.acknowledged) {
			return new Response(
				JSON.stringify({
					message: "Vendor added successfully",
					data: resp.data,
				}),
				{ status: 201 },
			);
		}

		return new Response(JSON.stringify({ message: "error adding vendor" }), {
			status: 400,
		});
	},
};
