import { MongoDocument } from "../types.ts";
import { Bill } from "./Bills.ts";
import { archiveBills, bills, getClient } from "./conn.ts";

export type Archive = Bill;
export type ArchiveDocument = Archive & MongoDocument & { archived_at: string };

export async function MoveToArchive(bill_id: string, user: string) {
	const client = await getClient();
	const session = client.startSession();

	try {
		const bill = await (await bills()).findOne({ bill_id });

		if (!bill) {
			throw new Error("Bill not found");
		}

		await (await archiveBills()).insertOne({
			...bill,
			archived_at: new Date(Date.now()).toUTCString(),
			history: [...bill.history, {
				action: "ARCHIVE",
				timestamp: Date.now(),
				user,
			}],
		});

		await session.commitTransaction();

		return bill;
	} catch (err: any) {
		console.error(err);
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}
}

export async function GetArchiveBills() {
	const resp = await (await archiveBills()).find().toArray();

	return resp;
}

export async function DeleteArhchiveBill(bill_id: string) {
	const resp = await (await archiveBills()).findOneAndDelete({
		bill_id,
	});

	return resp;
}
