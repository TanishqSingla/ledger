import { Handlers } from "$fresh/server.ts";
import { vendors } from "@db/conn.ts";
import { DeleteVendor } from "@db/Vendors.ts";

export const handler: Handlers = {
	POST: async function (req, _ctx) {
		const query = await req.json();

		const result = await (await vendors()).find({
			vendor_name: { $regex: query.value, $options: "i" },
		}).toArray();

		return new Response(JSON.stringify({ data: result }));
	},
	DELETE: async function (req, _ctx) {
		const values = await req.json();

		const resp = await DeleteVendor(values.vendor_id);

		if (resp.acknowledged) {
			return new Response(
				JSON.stringify({ message: "Vendor deleted successfully" }),
				{ status: 200 },
			);
		}

		return new Response(JSON.stringify({ message: "error adding vendor" }), {
			status: 400,
		});
	},
};
