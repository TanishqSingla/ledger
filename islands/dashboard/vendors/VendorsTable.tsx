import { signal } from "@preact/signals";
import { VendorDocument } from "../../../db/Vendors.ts";
import { vendorSearch } from "./VendorSearchbox.tsx";
import { Button } from "ketu";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "../../../components/Button.tsx";
import {
	OpenInNewWindow,
	TrashIcon,
} from "../../../components/icons/index.tsx";
import { useMutation } from "../../../hooks/useMutation.ts";
import { deleteVendor } from "../../../services/vendor.ts";

export const vendorsSignal = signal<VendorDocument[]>([]);

function VendorsTable() {
	const mutation = useMutation({
		mutationFn: deleteVendor,
		onError: (err) => {
			console.log(err);
		},
	});

	const handleDelete = async (vendor: VendorDocument) => {
		await mutation.mutate({ vendor_id: vendor.vendor_id });
		vendorsSignal.value = vendorsSignal.value?.filter((_vendor) =>
			_vendor.vendor_id != vendor.vendor_id
		);
	};

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
				{vendorsSignal.value.flatMap((vendor) =>
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
										disabled={mutation.isLoading}
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

export default function WithSignal(
	{ vendors }: { vendors: VendorDocument[] },
) {
	vendorsSignal.value = vendors;
	return <VendorsTable />;
}
