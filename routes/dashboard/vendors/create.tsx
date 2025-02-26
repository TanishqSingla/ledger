import { Handlers } from "$fresh/server.ts";
import { Button } from "ketu";
import Input from "../../../components/Input.tsx";
import { PutVendor } from "../../../db/Vendors.ts";

export const handler: Handlers = {
	POST: async function (req, ctx) {
		const formData = await req.formData();

		const resp = await PutVendor({
			vendor_name: formData.get("vendor_name") as string,
			...(!!formData.get("email") && { email: formData.get("email") }),
			...(!!formData.get("phone") && { phone: formData.get("phone") }),
		});

		return ctx.render();
	},
};

export default function VendorCreate() {
	return (
		<div class="p-4">
			<h1 class="text-display-small my-8">Create Vendor</h1>

			<form
				class="border border-primary p-4 max-w-screen-sm rounded-xl flex flex-col gap-4"
				method="POST"
			>
				<label htmlFor="vendor_name" class="text-label-large">
					Vendor Name
					<Input
						placeholder="Vendor Name"
						name="vendor_name"
						id="vendor_name"
						required
					/>
				</label>

				<label htmlFor="email" class="text-label-large">
					Vendor Email
					<Input placeholder="Email" id="email" name="email" />
				</label>

				<label htmlFor="phone" class="text-label-large">
					Vendor Phone
					<Input placeholder="Phone" id="phone" name="phone" />
				</label>

				<Button class="bg-tertiary text-onTertiary px-4 py-2 rounded-xl my-4">
					Create
				</Button>
			</form>
		</div>
	);
}
