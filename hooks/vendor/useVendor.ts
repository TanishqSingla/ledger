import { VendorDocument } from "@db/Vendors.ts";
import { deleteVendor, putVendor } from "@queries/vendor.ts";
import { useMutation } from "../useMutation.ts";
import { computed, signal } from "@preact/signals";
import { vendorSearch } from "../../islands/dashboard/vendors/VendorSearchbox.tsx";

export const vendorsSignal = signal<VendorDocument[] | null>(null);

let current = new Float64Array(256);
let buffer = new Float64Array(256);
function getEditDistance(word1: string, word2: string) {
  const len1 = word1.length + 1;
  const len2 = word2.length + 1;

  for (let col = 0; col < len1; ++col) current[col] = col;

  for (let row = 1; row < len2; ++row) {
    buffer[0] = row;
    for (let col = 1; col < len1; col++) {
      if (word1[col - 1] == word2[row - 1]) {
        buffer[col] = current[col - 1];
      } else {
        buffer[col] = Math.min(
          buffer[col - 1] + 1,
          current[col] + 1,
          current[col - 1] + 1,
        );
      }
    }
    [buffer, current] = [current, buffer];
  }

  return current[word1.length];
}



export default function useVendor(initialData: VendorDocument[]) {
	const data = computed(() => {
		if (vendorsSignal.value) {
			return vendorsSignal.value;
		}

		return initialData;
	});

	const filteredVendors = computed(() => {
		if (!data?.value) return [];

		if (!vendorSearch.value) return data.value;

		const searchTerm = vendorSearch.value.toLowerCase();
		const vendors = data.value.map((vendor) => {
			const terms = vendor.vendor_name.toLowerCase().split(" ").filter((term) =>
				term.length >= 3
			);
			const leastDistance = Math.min(
				...terms.map((term) => getEditDistance(searchTerm, term)),
				getEditDistance(searchTerm, vendor.vendor_name),
			);

			return {
				...vendor,
				leastDistance,
			};
		});

		return vendors.toSorted((a, b) => a.leastDistance - b.leastDistance).filter(
			(vendor) =>
				(vendor.vendor_name.length - vendor.leastDistance) >=
					(vendor.vendor_name.length / 2),
		);
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
		searchData: filteredVendors,
		deleteMutation,
		handleDelete,
	};
}
