import { VendorDocument } from "../../db/Vendors.ts";
import { deleteVendor, putVendor } from "../../queries/vendor.ts";
import { useMutation } from "../useMutation.ts";
import { computed, signal } from "@preact/signals";

export const vendorsSignal = signal<VendorDocument[]>([]);
export const vendorOptimistic = signal<VendorDocument[] | null>(null);

export default function useVendor() {
	const data = computed(() => {
		if (vendorOptimistic.value) {
			return vendorOptimistic.value;
		}

		return vendorsSignal.value;
	});

	const deleteMutation = useMutation({
		mutationFn: deleteVendor,
		onError: (err) => {
			console.log(err);
		},
	});

	const createMutation = useMutation({
		mutationFn: putVendor,
		onError: (err) => {
			console.log(err);
		},
		onSuccess: (resp) => {
			vendorOptimistic.value = [...data.value, resp.data];
		},
	});

	const handleDelete = async (vendor: VendorDocument) => {
		await deleteMutation.mutate({ vendor_id: vendor.vendor_id });

		vendorOptimistic.value = data.value.filter((_vendor) =>
			_vendor.vendor_id != vendor.vendor_id
		);
	};

	return {
		createMutation,
		data,
		deleteMutation,
		handleDelete,
	};
}
