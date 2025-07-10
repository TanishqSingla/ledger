import { computed, signal } from "@preact/signals";
import type { BillDocument } from "@/types.ts";
import { useMutation } from "../useMutation.ts";

const paymentsSignal = signal<BillDocument["payments"] | null>(null);

async function postPayment(
	{ billId, payment }: {
		billId: string;
		payment: Required<BillDocument>["payments"][0];
	},
) {
	const resp = await fetch(`/api/bill/${billId}/payments`, {
		method: "POST",
		body: JSON.stringify(payment),
	});

	const data = await resp.json();

	return data as BillDocument;
}

async function deletePayment(
	{ billId, payment }: {
		billId: string;
		payment: Required<BillDocument>["payments"][0];
	},
) {
	const resp = await fetch(`/api/bill/${billId}/payments`, {
		method: "DELETE",
		body: JSON.stringify(payment),
	});

	const data = await resp.json();

	return data;
}

export default function usePayment(initialData: BillDocument["payments"]) {
	const data = computed(() => {
		if (paymentsSignal.value) {
			return paymentsSignal.value;
		}

		return initialData;
	});

	const createPayment = useMutation({
		mutationFn: postPayment,
		onSuccess: (_data, { payment }) => {
			if (!data.value) {
				paymentsSignal.value = _data.payments;
				return;
			}
			paymentsSignal.value = [...data.value, payment];
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deletePayment,
		onSuccess(_, params) {
			paymentsSignal.value = data.value?.filter((
				payment,
			) =>
				!(payment.reference_number === params.payment.reference_number &&
					payment.file === params.payment.file)
			);
		},
		onError(err) {
			console.log(err);
		},
	});

	return {
		data,
		createPayment,
		deletePayment: deleteMutation,
	};
}
