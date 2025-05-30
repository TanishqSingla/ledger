import { VendorDocument } from "@db/Vendors.ts";
import { deleteVendor, putVendor } from "@queries/vendor.ts";
import { useMutation } from "../useMutation.ts";
import { computed, signal } from "@preact/signals";

export const vendorsSignal = signal<VendorDocument[] | null>(null);

export default function useVendor(initialData: VendorDocument[]) {
	const data = computed(() => {
		if (vendorsSignal.value) {
			return vendorsSignal.value;
		}

		return initialData;
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
			console.error(err);
		},
		onSuccess: (resp) => {
			vendorsSignal.value = [...data.value, resp.data];
		},
	});

	const handleDelete = async (vendor: VendorDocument) => {
		await deleteMutation.mutate({ vendor_id: vendor.vendor_id });

		vendorsSignal.value = data.value.filter((_vendor) =>
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
