import { Button } from "ketu";
import { buttonVariants } from "@components/Button.tsx";
import { NoData, TrashIcon } from "@components/icons/index.tsx";
import useVendor from "../../../hooks/vendor/useVendor.ts";
import { vendorSearch } from "./VendorSearchbox.tsx";
import { VendorDocument } from "@db/Vendors.ts";

export function VendorsGrid({ vendors }: { vendors: VendorDocument[] }) {
	const { data, deleteMutation, handleDelete } = useVendor(vendors);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			{(!data.value || !data.value?.length) && (
				<div className="flex flex-col items-center justify-center my-8">
					<NoData width={128} height={128} />
					<p className="text-center">No Data</p>
				</div>
			)}
			{data.value && data.value.flatMap((vendor) =>
				vendor.vendor_name.toLowerCase().startsWith(vendorSearch.value)
					? (
						<div className="bg-surfaceContainerLow border border-outlineVariant rounded-xl p-4">
							<p className="text-title-large">{vendor.vendor_name}</p>

							<p className="text-label-large">
								Date added: {new Date(vendor.created_at).toLocaleDateString()}
							</p>

							<div className="mt-4 flex gap-4 items-center">
								<Button
									className={buttonVariants({
										variant: "text",
										className: "ml-auto",
									})}
									as="a"
									href={`/dashboard/vendors/${vendor.vendor_id}`}
								>
									View
								</Button>

								<button
									type="button"
									title="Delete"
									aria-label="delete vendor button"
									onClick={() => handleDelete(vendor)}
									disabled={deleteMutation.isLoading}
								>
									<TrashIcon />
								</button>
							</div>
						</div>
					)
					: []
			)}
		</div>
	);
}
