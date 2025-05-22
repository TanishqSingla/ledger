import { Handlers } from "$fresh/server.ts";
import { DeleteArhchiveBill } from "@db/ArchiveBills.ts";

export const handler: Handlers<unknown, { email_id: string }> = {
	async DELETE(_req, ctx) {
		const { archive_id } = ctx.params;

		try {
			await DeleteArhchiveBill(archive_id);

			return new Response(
				JSON.stringify({
					success: true,
					message: "Bill deleted successfully ",
				}),
			);
		} catch (err: unknown) {
			console.log(err);
			return new Response(
				JSON.stringify({ message: "Internal Server Error" }),
				{ status: 500 },
			);
		}
	},
};
