import { Handlers } from "$fresh/server.ts";
import { Button } from "ketu";
import Input from "../../../components/Input.tsx";
import { PutVendor } from "../../../db/Vendors.ts";

export const handler: Handlers = {
	POST: async function (req, ctx) {
		const formData = await req.formData();

		const resp = await PutVendor({ vendor_name: formData.get("vendor_name") as string });

		return ctx.render();
	},
};

export default function VendorCreate() {
	return (
		<div class="p-4">
			<h1 class="text-display-small my-8">Create Vendor</h1>

			<form class="border border-primary p-4 max-w-screen-sm rounded-xl" method="POST">
				<label htmlFor="vendor_name">Vendor Name</label>
				<Input placeholder="Vendor Name" name="vendor_name" id="vendor_name" />

				<Button class="bg-tertiary text-onTertiary px-4 py-2 rounded-xl my-4">
					Create
				</Button>
			</form>
		</div>
	);
}
