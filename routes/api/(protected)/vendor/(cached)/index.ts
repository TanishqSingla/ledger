import { Handlers } from "$fresh/server.ts";
import { VendorRepository, vendors } from "@repositories/repos.ts";

export const handler: Handlers = {
	POST: async function (req, _ctx) {
		const query = await req.json();

		const result = await vendors.Find({
			vendor_name: { $regex: query.value, $options: "i" },
		});

		return new Response(JSON.stringify({ data: result }));
	},
	PUT: async function (req, _ctx) {
		const values = await req.json();

		const vendor = VendorRepository.NewVendorDoc({
			vendor_name: values["vendor_name"],
			email: values["email"],
			phone: values["phone"],
			accounts: [],
		});

		const resp = await vendors.InsertOne(vendor);

		if (resp.acknowledged) {
			return new Response(
				JSON.stringify({
					message: "Vendor added successfully",
					data: vendor,
				}),
				{ status: 201 },
			);
		}

		return new Response(JSON.stringify({ message: "error adding vendor" }), {
			status: 400,
		});
	},
	DELETE: async function (req, _ctx) {
		const values = await req.json();

		const resp = await vendors.DeleteOne({ vendor_id: values.vendor_id });

		if (resp) {
			return new Response(
				JSON.stringify({ message: "Vendor deleted successfully" }),
				{ status: 200 },
			);
		}

		return new Response(JSON.stringify({ message: "error deleting vendor" }), {
			status: 400,
		});
	},
};
