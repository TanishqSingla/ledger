import { Handlers, PageProps } from "$fresh/server.ts";
import { GetAllVendors, VendorDocument } from "../../../db/Vendors.ts";
import CreateVendorModal from "../../../islands/dashboard/vendors/CreateVendorModal.tsx";
import VendorsData from "../../../islands/dashboard/vendors/vendors-data.tsx";
import VendorSearchBox from "../../../islands/dashboard/vendors/VendorSearchbox.tsx";
import DisplayPreference from "../../../islands/molecules/display-preference.tsx";

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

			<section class="flex items-center my-8 gap-4">
				<div class="flex gap-4">
					<VendorSearchBox />
				</div>

				<div class={"ml-auto flex gap-4"}>
					<DisplayPreference />

					<CreateVendorModal />
				</div>
			</section>

			<VendorsData vendors={data.vendors} />
		</div>
	);
}
