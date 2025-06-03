import { computed, signal } from "@preact/signals";
import { BillDocument } from "@db/Bills.ts";
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
				paymentsSignal.value = _data.payments
				return
			}
			paymentsSignal.value = [...data.value, payment]
		},
		onError: (err) => {
			console.log(err);
		},
	});

	return {
		data,
		createPayment,
	};
}
