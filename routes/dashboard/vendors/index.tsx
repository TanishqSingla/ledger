import { Handlers, PageProps } from "$fresh/server.ts";
import { GetAllVendors, VendorDocument } from "../../../db/Vendors.ts";
import { Button } from "ketu";
import CreateVendorModal from "../../../islands/dashboard/vendors/CreateVendorModal.tsx";
import VendorSearchBox from "../../../islands/dashboard/vendors/VendorSearchbox.tsx";
import VendorsTable from "../../../islands/dashboard/vendors/VendorsTable.tsx";

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
					<VendorSearchBox />
					<Button class="text-tertiary border border-tertiary px-4 py-2 rounded-xl hover:bg-tertiary hover:text-onTertiary transition">
						Search
					</Button>
				</div>

				<div class="ml-auto">
					<CreateVendorModal />
				</div>
			</div>
			<div class="rounded-xl overflow-hidden relative mt-8 border">
				<VendorsTable vendors={data.vendors} />
			</div>
		</div>
	);
}
