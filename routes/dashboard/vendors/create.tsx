import { Handlers } from "$fresh/server.ts";
import Input from "@components/Input.tsx";
import AddVendorAccount from "@islands/dashboard/vendors/AddVendorAccount.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { KV_KEYS } from "@utils/constants.ts";
import { kv } from "@utils/db.ts";
import { VendorRepository, vendors } from "@repositories/repos.ts";
import { VendorDocument } from "@/types.ts";

export const handler: Handlers = {
	async POST(req, ctx) {
		const formData = await req.formData();

		const accounts: Record<string, Record<string, string>> = {};
		// Group accounts
		for (const [key, value] of formData.entries()) {
			const match = key.match(/.*_(\$[A-Za-z0-9-_]+$)/);

			if (match) {
				const [, id] = match;
				if (!accounts[id]) accounts[id] = {};

				if (!accounts[id].id) accounts[id].id = id.replace("$", "");

				accounts[id][key.replace(`_${id}`, "")] = value.toString();
			}
		}

		const vendorDoc = VendorRepository.NewVendorDoc({
			vendor_name: formData.get("vendor_name")!.toString(),
			...(formData.get("email") &&
				{ email: formData.get("email")!.toString() }),
			...(formData.get("phone") &&
				{ phone: formData.get("phone")!.toString() }),
			accounts: Object.values(accounts) as VendorDocument["accounts"],
		});

		try {
			const resp = await vendors.InsertOne(vendorDoc);

			console.log("[Cache]: Invalidated", KV_KEYS.VENDORS);
			kv.delete([KV_KEYS.VENDORS]);

			return Response.redirect(
				ctx.url.origin + "/dashboard/vendors/" + resp.data.vendor_id,
			);
		} catch (err) {
			console.log(err);

			return Response.json(err, { status: 500 });
		}
	},
};

export default function CreateVendor() {
	return (
		<main className="max-w-screen-sm mx-auto p-4">
			<h1 class="text-display-small">Create Vendor</h1>

			<form method="POST" className="p-4 rounded-xl">
				<div className="my-4">
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
				</div>

				<AddVendorAccount />

				<div class="flex items-center justify-end gap-2">
					<button
						type="submit"
						className={buttonVariants({ variant: "filled" })}
					>
						Create
					</button>
				</div>
			</form>
		</main>
	);
}
