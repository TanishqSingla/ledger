import { PutBill } from "../../../../db/Bills.ts";
import { Handlers } from "fresh/compat";

export const handler: Handlers = {
	PUT: async function (ctx) {
		const req = ctx.req;
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
