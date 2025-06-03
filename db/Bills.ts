import { FindOptions } from "mongodb";
import { archiveBills, bills, getClient } from "./conn.ts";
import { MongoDocument } from "../types.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

type BillHistoryTypes =
	| {
		action: "CREATE" | "ARCHIVE" | "RESTORE";
	}
	| {
		action: "UPDATE";
		type: "ADD_PAYMENT" | "REMOVE_PAYMENT";
	};

type History = BillHistoryTypes & { user: string; timestamp: number };

export type Bill = {
	bill_id: string;
	amount?: number | string;
	vendor_id: string;
	vendor_name: string;
	status: "PENDING" | "IN_PAYMENT" | "PAID";
	history: History[];
	comments?: { comment: string; user: string }[];
	payments?: {
		reference_number?: string;
		vendor_account?: string;
		file?: string;
	}[];
	invoices?: string[];
};

export type BillDocument = Bill & MongoDocument;

export async function QueryBills(
	{ limit, vendor_id, page = 1 }: {
		limit?: number;
		vendor_id?: string;
		page: number;
	},
) {
	const skip = (limit || 10) * (page - 1);
	const queryOptions = {
		limit,
	} satisfies FindOptions;

	const filters = {
		...(vendor_id && { vendor_id }),
	};

	const resp = await (await bills()).find(filters, queryOptions).sort({
		created_at: 1,
	}).skip(skip).toArray();
	return resp as BillDocument[];
}

export async function SearchBills(
	{ query }: { query: string },
) {
	const resp = await (await bills()).find({
		$or: [{ vendor_name: { $regex: query, $options: "i" } }],
	}).toArray();

	return resp as BillDocument[];
}

export async function PutBill(
	bill: Bill,
	user: string,
) {
	const doc = {
		bill_id: nanoid(12),
		vendor_id: bill.vendor_id,
		vendor_name: bill.vendor_name,
		amount: bill.amount,
		invoices: bill?.invoices,
		status: bill.status || "PENDING",
		created_at: new Date(Date.now()),
		updated_at: new Date(Date.now()),
		history: [{
			action: "CREATE",
			user,
			timestamp: Date.now(),
		}],
	} satisfies Bill & { created_at: Date; updated_at: Date };

	const resp = await (await bills()).insertOne({ ...doc });

	return { ...resp, data: doc };
}

export async function GetBillFromId(bill_id: string) {
	const resp = (await bills()).findOne({ bill_id });

	return resp as Promise<BillDocument>;
}

export async function PostBillPayment(
	bill_id: string,
	user: string,
	payment: Required<Bill>["payments"][0],
) {
	const resp = await (await bills()).findOneAndUpdate({ bill_id }, {
		$push: {
			payments: payment,
			history: {
				action: "UPDATE",
				type: "ADD_PAYMENT",
				user,
				timestamp: Date.now(),
			},
		},
	});

	return resp;
}

export async function MoveToBill(bill_id: string, user: string) {
	const client = await getClient();
	const session = client.startSession();

	try {
		session.startTransaction();

		const bill = await (await archiveBills()).findOneAndDelete({ bill_id });

		if (!bill) {
			throw new Error("Archive bill not found");
		}

		await (await bills()).insertOne({
			...bill,
			history: [...bill.history, {
				action: "RESTORE",
				timestamp: Date.now(),
				user,
			}],
		});

		await session.commitTransaction();

		return bill;
	} catch (err: unknown) {
		console.error(err);
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}
}

export async function GetPaginationInfo() {
	const resp = await (await bills()).estimatedDocumentCount();

	return resp;
}

export async function DeletePayment(
	{ bill_id, user, reference_number, file }: {
		bill_id: string;
		user: string;
		reference_number?: string;
		file?: string;
	},
) {
	const resp = await (await bills()).updateOne({ bill_id }, {
		$pull: { payments: { reference_number, file } },
		$push: {
			history: {
				action: "UPDATE",
				type: "REMOVE_PAYMENT",
				user,
				timestamp: Date.now(),
			},
		},
	});

	return resp;
}
