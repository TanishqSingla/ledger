import { Handlers } from "$fresh/server.ts";
import { bills, BillsRepository } from "@repositories/repos.ts";

export const handler: Handlers<unknown, { email_id: string }> = {
	PUT: async function (req, ctx) {
		const values = await req.json();

		const billDoc = BillsRepository.NewBill({ ...values }, ctx.state.email_id);
		const response = await bills.InsertOne(billDoc);

		if (response.acknowledged) {
			return Response.json({
				message: "Bill added successfully",
				data: billDoc,
			}, { status: 201 });
		}

		return new Response(JSON.stringify({ message: "error adding vendor" }), {
			status: 400,
		});
	},
};
