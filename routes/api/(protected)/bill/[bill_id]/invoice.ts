import { Handlers } from "$fresh/server.ts";
import { delete_file } from "@queries/s3.ts";
import { DeleteInvoice } from "@db/Bills.ts";

export const handler: Handlers<unknown, { email_id: string }> = {
	async DELETE(req, ctx) {
		const billId = ctx.params.bill_id;
		const user = ctx.state.email_id;
		const payload = await req.json();

		try {
			const resp = await delete_file(payload.invoice);

			const _resp = await DeleteInvoice({
				bill_id: billId,
				user,
				invoice: payload.invoice,
			});
			return Response.json({ ...resp, ..._resp });
		} catch (err) {
			return Response.json(err, { status: 500 });
		}
	},
};
