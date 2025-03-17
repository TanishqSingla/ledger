import { FindOptions } from "mongodb";
import { bills } from "./conn.ts";
import { MongoDocument } from "../types.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export type Bill = {
	bill_id: string;
	amount?: number | string;
	vendor_id: string;
	vendor_name: string;
	status: "PENDING" | "IN_PAYMENT" | "PAID";
};

export type BillDocument = Bill & MongoDocument;

export async function QueryBills({ limit }: { limit?: number }) {
	const queryOptions = {
		limit,
	} satisfies FindOptions;

	const resp = await (await bills()).find({}, queryOptions).toArray();

	return resp;
}

export async function PutBill(
	bill: Pick<Bill, "vendor_id" | "vendor_name" | "amount" | "status">,
) {
	const doc = {
		bill_id: nanoid(12),
		vendor_id: bill.vendor_id,
		vendor_name: bill.vendor_name,
		amount: bill.amount,
		status: bill.status || "PENDING",
		created_at: new Date(Date.now()).toUTCString(),
		updated_at: new Date(Date.now()).toUTCString(),
	};

	const resp = await (await bills()).insertOne({ ...doc });

	return { ...resp, data: doc };
}

export async function GetBillFromId(bill_id: string) {
	const resp = (await bills()).findOne({ bill_id });

	return resp as Promise<BillDocument>;
}
