import { PostBillPayment } from "@db/Bills.ts";
import { HandlerByMethod } from "fresh";

export const handler: HandlerByMethod<null, { email_id: string }> = {
	async POST(ctx) {
		const req = ctx.req;
		const billId = ctx.params.bill_id;
		const user = ctx.state.email_id as string;
		const payload = await req.json();

		try {
			const resp = await PostBillPayment(billId, user, payload);

			return new Response(JSON.stringify({ ...resp }), { status: 201 });
		} catch (err: any) {
			console.error(err);

			return new Response(JSON.stringify({ error: err }), { status: 500 });
		}
	},
};
