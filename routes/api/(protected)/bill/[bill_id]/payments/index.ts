import { Handlers } from "$fresh/server.ts";
import { PostBillPayment } from "@db/Bills.ts";

export const handler: Handlers = {
	async POST(req, ctx) {
		const billId = ctx.params.bill_id;
		const user = ctx.state.email_id as string;
		const payload = await req.json();

		try {
			const resp = await PostBillPayment(billId, user, payload);

			return Response.json(resp, { status: 201 });
		} catch (err: any) {
			console.error(err);

			return new Response(JSON.stringify({ error: err }), { status: 500 });
		}
	},
};
