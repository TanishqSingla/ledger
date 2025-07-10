import { computed, signal } from "@preact/signals";
import type { BillDocument } from "@/types.ts";
import { useMutation } from "../useMutation.ts";

const invoiceSignal = signal<BillDocument["invoices"] | null>(null);

const deleteQuery = async (
	{ billId, invoice }: { billId: string; invoice: string },
) => {
	const res = await fetch(`/api/bill/${billId}/invoice`, {
		method: "DELETE",
		body: JSON.stringify({ invoice }),
	});

	const data = res.json();
	return data;
};

export default function useInvoice(
	initialData: Required<BillDocument>["invoices"] | null,
) {
	const data = computed(() => {
		if (invoiceSignal.value) {
			return invoiceSignal.value;
		}

		return initialData;
	});

	const deletMutation = useMutation({
		mutationFn: deleteQuery,
		onSuccess(_, params) {
			invoiceSignal.value = data.value?.filter((invoice) =>
				invoice === params.invoice
			);
		},
		onError(err) {
			console.log(err);
		},
	});

	return {
		data,
		deleteInvoice: deletMutation,
	};
}
