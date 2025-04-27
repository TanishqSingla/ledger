import { Handlers } from "$fresh/server.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { uploadFile } from "../../../queries/s3.ts";

export const handler: Handlers = {
	PUT: async function (req, _ctx) {
		const payload = await req.formData();

		const invoices = payload.get("invoices") as File;

		try {
			const id = nanoid(8);
			const resp = await uploadFile(id, invoices, invoices.type);

			return new Response(JSON.stringify({ ...resp, invoice: id }), {
				status: resp.$metadata.httpStatusCode,
			});
		} catch (err: any) {
			return new Response(JSON.stringify({ err: err.message }), {
				status: 500,
			});
		}
	},
};
