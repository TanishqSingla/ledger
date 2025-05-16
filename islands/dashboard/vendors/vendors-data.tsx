import { VendorDocument } from "../../../db/Vendors.ts";
import {
	DISPLAY_TYPE,
	displayTypeSignal,
} from "../../molecules/display-preference.tsx";
import { VendorsGrid } from "./vendors-grid.tsx";
import { VendorsTable } from "./VendorsTable.tsx";

export default function VendorsData(
	{ vendors }: { vendors: VendorDocument[] },
) {
	if (displayTypeSignal.value === DISPLAY_TYPE.LIST) {
		return (
			<>
				<p className={"text-body-small my-4"}>
					Showing {vendors.length} items
				</p>
				<section class="rounded-xl overflow-hidden relative border">
					<VendorsTable vendors={vendors} />
				</section>
			</>
		);
	}

	return (
		<section>
			<VendorsGrid vendors={vendors} />
		</section>
	);
}
