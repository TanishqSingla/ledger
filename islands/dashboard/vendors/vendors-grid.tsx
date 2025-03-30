import { buttonVariants } from "../../../components/Button.tsx";
import { NoData, TrashIcon } from "../../../components/icons/index.tsx";
import { VendorDocument } from "../../../db/Vendors.ts";
import { useMutation } from "../../../hooks/useMutation.ts";
import { deleteVendor } from "../../../services/vendor.ts";
import { vendorSearch } from "./VendorSearchbox.tsx";
import { vendorsSignal } from "./VendorsTable.tsx";

export function VendorsGrid() {
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
		<div className={"flex flex-wrap gap-6"}>
			{!vendorsSignal.value.length && (
				<div className={"flex flex-col items-center justify-center my-8"}>
					<NoData width={128} height={128} />
					<p className={"text-center"}>No Data</p>
				</div>
			)}
			{vendorsSignal.value.length > 0 && vendorsSignal.value.flatMap((vendor) =>
				vendor.vendor_name.toLowerCase().startsWith(vendorSearch.value)
					? (
						<div
							className={"bg-surfaceContainerLow border border-outlineVariant rounded-xl p-4 min-w-72"}
						>
							<p className={"text-title-large"}>{vendor.vendor_name}</p>

							<p className={"text-label-large"}>
								Date added: {new Date(vendor.created_at).toLocaleDateString()}
							</p>

							<div className={"mt-4 flex gap-4 items-center"}>
								<button
									className={buttonVariants({
										variant: "text",
										className: "ml-auto",
									})}
								>
									View
								</button>

								<button
									title={"Delete"}
									aria-label={"delete vendor button"}
									onClick={() => handleDelete(vendor)}
									disabled={mutation.isLoading}
								>
									<TrashIcon />
								</button>
							</div>
						</div>
					)
					: []
			)}

			<div className={"bg-surfaceContainerLow"}>
			</div>
		</div>
	);
}
