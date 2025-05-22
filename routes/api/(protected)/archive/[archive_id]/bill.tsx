import { Handlers } from "$fresh/server.ts";
import { MoveToBill } from "@db/Bills.ts";

export const handler: Handlers<unknown, { email_id: string }> = {
	async POST(_, ctx) {
		const billId = ctx.params.archive_id;
		const user = ctx.state.email_id;

		try {
			const resp = await MoveToBill(billId, user);

			if (resp?.bill_id) {
				return new Response(
					JSON.stringify({
						status: "success",
						message: "Bill restored successfully",
					}),
					{ status: 200 },
				);
			}

			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: err }), { status: 500 });
		}
	},
};
