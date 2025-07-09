import type { Bill, MongoDocument } from "@/types.ts";
import { archiveBills, bills, getClient } from "./conn.ts";

export type Archive = Bill;
export type ArchiveDocument = Archive & MongoDocument & { archived_at: Date };

export async function MoveToArchive(bill_id: string, user: string) {
	const client = await getClient();
	const session = client.startSession();

	try {
		session.startTransaction();

		const bill = await (await bills()).findOneAndDelete({ bill_id });

		if (!bill) {
			throw new Error("Bill not found");
		}

		await (await archiveBills()).insertOne({
			...bill,
			archived_at: new Date(Date.now()),
			history: [...bill.history, {
				action: "ARCHIVE",
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

export async function GetArchiveBills() {
	const resp = await (await archiveBills()).find().toArray();

	return resp;
}

export async function GetArchiveBillById(bill_id: string) {
	const resp = await (await archiveBills()).findOne({
		bill_id,
	});

	return resp;
}

export async function DeleteArhchiveBill(bill_id: string) {
	const resp = await (await archiveBills()).findOneAndDelete({
		bill_id,
	});

	return resp;
}
