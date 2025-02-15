import { Handlers, PageProps } from "$fresh/server.ts";
import Input from "../../../components/Input.tsx";
import { GetAllVendors, VendorDocument } from "../../../db/Vendors.ts";
import { Button } from "ketu";
import CreateVendorModal from "../../../islands/dashboard/vendors/CreateVendorModal.tsx";

type Vendor = {
	vendor_id: string;
	vendor_name: string;
	phone: string;
	email: string;
	created_at: string;
};

type Data = {
	vendors: VendorDocument[];
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const data = await GetAllVendors();

		return ctx.render({ vendors: data });
	},
};
export default function Vendors({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-small">Vendors</h1>

			<div class="flex my-8">
				<div class="flex gap-4">
					<Input type="search" placeholder={"search"} autofocus />
					<Button class="text-tertiary border border-tertiary px-4 py-2 rounded-xl hover:bg-tertiary hover:text-onTertiary transition">
						Search
					</Button>
				</div>

				<div class="ml-auto">
					<CreateVendorModal />
				</div>
			</div>
			<div class="rounded-xl overflow-hidden relative mt-8 border">
				<table class="table-auto w-full border-collapse">
					<thead>
						<tr>
							<th class="px-4 py-2 bg-surfaceContainer text-left">
								Vendor Name
							</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Email</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Phone</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">
								Created At
							</th>
						</tr>
					</thead>
					<tbody>
						{data.vendors.map((vendor) => (
							<tr key={vendor.vendor_id} class="border-b last:border-none">
								<td class="py-2 px-4">
									<a
										href={`/dashboard/vendors/${vendor.vendor_id}`}
										class="hover:underline"
									>
										{vendor.vendor_name}
									</a>
								</td>
								<td class="py-2 px-4">{vendor?.email}</td>
								<td class="py-2 px-4">{vendor?.phone}</td>
								<td class="py-2 px-4">
									{new Date(vendor.created_at).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
