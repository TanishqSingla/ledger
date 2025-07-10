import { FindOptions } from "mongodb";
import { archiveBills, bills, getClient } from "./conn.ts";
import { type Bill, type BillDocument } from "@/types.ts";

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
		created_at: -1,
	}).skip(skip).toArray();
	return resp as BillDocument[];
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

export async function DeleteInvoice(
	{ bill_id, user, invoice }: {
		bill_id: string;
		user: string;
		invoice: string;
	},
) {
	const resp = await (await bills()).updateOne({ bill_id }, {
		$pull: { invoices: { $eq: invoice } },
		$push: {
			history: {
				action: "UPDATE",
				type: "REMOVE_INVOICE",
				timestamp: Date.now(),
				user,
			},
		},
	});

	return resp;
}
