import { GetAllVendors, VendorDocument } from "@db/Vendors.ts";
import CreateVendorModal from "../../../islands/dashboard/vendors/CreateVendorModal.tsx";
import VendorsData from "../../../islands/dashboard/vendors/vendors-data.tsx";
import VendorSearchBox from "../../../islands/dashboard/vendors/VendorSearchbox.tsx";
import DisplayPreference from "../../../islands/molecules/display-preference.tsx";
import { KV_KEYS } from "@utils/constants.ts";
import { kv } from "@utils/db.ts";

export default async function Vendors() {
	let vendors: VendorDocument[];

	const cache = await kv.get<VendorDocument[]>([KV_KEYS.VENDORS]);
	if (!!cache.value && cache.value?.length > 0) {
		console.log("[Cache]: vendors hit");

		vendors = cache.value;
	} else {
		const data = await GetAllVendors();
		vendors = data;
		kv.set([KV_KEYS.VENDORS], data);
	}

	return (
		<div class="p-4">
			<h1 class="text-display-small">Vendors</h1>

			<section class="flex items-center my-8 gap-4">
				<div class="flex gap-4">
					<VendorSearchBox />
				</div>

				<div class="ml-auto flex gap-4">
					<DisplayPreference />

					<CreateVendorModal vendors={vendors} />
				</div>
			</section>

			<VendorsData vendors={vendors} />
		</div>
	);
}
