import { Handlers } from "$fresh/server.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { uploadFile } from "@queries/s3.ts";
import { S3_FOLDERS } from "@utils/constants.ts";

export const handler: Handlers = {
	POST: async function (req, _ctx) {
		const payload = await req.formData();

		const invoice = payload.get("invoice") as File;

		try {
			const id = nanoid(8);
			const key = S3_FOLDERS.INVOICES + id;
			const resp = await uploadFile(key, invoice, invoice.type);

			return new Response(JSON.stringify({ ...resp, invoice: key }), {
				status: resp.$metadata.httpStatusCode,
			});
		} catch (err: any) {
			console.log(err);
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
			});
		}
	},
};
