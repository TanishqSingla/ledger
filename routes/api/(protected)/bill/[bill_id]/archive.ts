import { Handlers } from "$fresh/server.ts";
import { MoveToArchive } from "@db/ArchiveBills.ts";

export const handler: Handlers<any, { email_id: string }> = {
	async POST(_, ctx) {
		const billId = ctx.params.bill_id;
		const user = ctx.state.email_id;

		try {
			const resp = await MoveToArchive(billId, user);

			if (resp?.bill_id) {
				return Response.redirect(`/dashbard/archive/${resp.bill_id}`, 303);
			}

			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: err }), { status: 500 });
		}
	},
};
