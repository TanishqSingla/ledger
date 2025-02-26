import { VendorDocument } from "../../../db/Vendors.ts";
import { vendorSearch } from "./VendorSearchbox.tsx";

export default function VendorsTable(
	{ vendors }: { vendors: VendorDocument[] },
) {
	return (
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
					<th class="px-4 py-2 bg-surfaceContainer text-left"/>
				</tr>
			</thead>
			<tbody>
				{vendors.flatMap((vendor) =>
					vendor.vendor_name.toLowerCase().startsWith(vendorSearch.value)
						? (
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
								<td class="py-2 px-4">
									<a
										href={`/dashboard/vendors/${vendor.vendor_id}`}
										class="hover:underline text-blue-500"
										target={"_blank"}
									>
										view more
									</a>
								</td>
							</tr>
						)
						: []
				)}
			</tbody>
		</table>
	);
}
