import { vendorSearch } from "./VendorSearchbox.tsx";
import { Button } from "ketu";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "../../../components/Button.tsx";
import {
	NoData,
	OpenInNewWindow,
	TrashIcon,
} from "../../../components/icons/index.tsx";
import useVendor from "../../../hooks/vendor/useVendor.ts";
import { VendorDocument } from "../../../db/Vendors.ts";

export function VendorsTable({vendors}: { vendors: VendorDocument[] }) {
	const { data, deleteMutation, handleDelete } = useVendor(vendors);

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
					<th class="px-4 py-2 bg-surfaceContainer text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{(!data.value || !data.value.length) && (
					<tr
						className={"min-h-60"}
					>
						<td colspan={7}>
							<div className={"flex flex-col items-center justify-center my-8"}>
								<NoData width={128} height={128} />
								<p className={"text-center"}>No Data</p>
							</div>
						</td>
					</tr>
				)}
				{data.value && data.value.flatMap((vendor) =>
					vendor.vendor_name.toLowerCase().startsWith(vendorSearch.value)
						? (
							<tr
								key={vendor.vendor_id}
								class="border-b last:border-none hover:bg-tertiaryContainer/20"
							>
								<td class="py-2 px-4">
									<a
										href={`/dashboard/vendors/${vendor.vendor_id}`}
										class="hover:underline"
									>
										{vendor.vendor_name}
									</a>
								</td>
								<td class="py-2 px-4">{vendor?.email || "-"}</td>
								<td class="py-2 px-4">{vendor?.phone || "-"}</td>
								<td class="py-2 px-4">
									{new Date(vendor.created_at).toLocaleDateString()}
								</td>
								<td class="py-2 px-4 flex gap-4 items-center">
									<a
										href={`/dashboard/vendors/${vendor.vendor_id}`}
										class="hover:underline text-blue-500"
										target={"_blank"}
										title={"Open in new window"}
									>
										<OpenInNewWindow />
									</a>
									<Button
										class={twMerge(
											buttonVariants({
												variant: "link",
												class: "hover:underline p-2 text-error",
											}),
										)}
										title="Remove vendor"
										aria-label="Remove vendor"
										onClick={() => handleDelete(vendor)}
										disabled={deleteMutation.isLoading}
									>
										<TrashIcon />
									</Button>
								</td>
							</tr>
						)
						: []
				)}
			</tbody>
		</table>
	);
}
