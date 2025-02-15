import { bills } from "./conn.ts";

export type Bill = {
	amount: number | string;
	vendor_id: string;
	vendor_name: string;
	created_at: string;
	updated_at: string;
	status: "PENDING" | "IN_PAYMENT" | "PAID";
};

export async function QueryBills({ limit }: { limit?: number }) {
	const queryOptions = {
		limit,
	};

	const resp = await bills.find({}, queryOptions).toArray();

	return resp;
}

export async function PutBill(
	bill: Pick<Bill, "vendor_id" | "vendor_name" | "amount" | "status">,
) {
	const doc = {
		vendor_id: bill.vendor_id,
		vendor_name: bill.vendor_name,
		amount: bill.amount,
		status: bill.status || "PENDING",
		created_at: new Date(Date.now()).toUTCString(),
		updated_at: new Date(Date.now()).toUTCString(),
	} satisfies Bill;

	const resp = await bills.insertOne({ ...doc });

	return resp;
}

export async function GetBillFromId(bill_id: string) {
	const resp = await bills.findOne({ bill_id });

	return resp;
}
