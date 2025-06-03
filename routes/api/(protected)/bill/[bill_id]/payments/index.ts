import { Handlers } from "$fresh/server.ts";
import { DeletePayment, PostBillPayment } from "@db/Bills.ts";
import { delete_file } from "@queries/s3.ts";

export const handler: Handlers<{}, { email_id: string }> = {
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
	async DELETE(req, ctx) {
		const billId = ctx.params.bill_id;
		const user = ctx.state.email_id;
		const payload = await req.json();

		try {
			const resp = {};

			if (payload?.file) {
				const _resp = await delete_file(payload.file);
				Object.assign(resp, _resp);
			}

			const _resp = DeletePayment({
				bill_id: billId,
				file: payload?.file,
				reference_number: payload?.reference_number,
				user,
			});

			Object.assign(resp, _resp);

			return Response.json(resp);
		} catch (err) {
			console.log(err);

			return Response.json({ err }, { status: 500 });
		}
	},
};
