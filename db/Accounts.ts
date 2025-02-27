import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import { MongoDocument } from "../types.ts";
import { accounts } from "./conn.ts";

export type Account = {
	account_id: string;
	account_name: string;
};

export type AccountDocument = Account & MongoDocument;

export const GetAllAccounts = async () => {
	const data = await (await accounts()).find().toArray();

	return data;
};

export const PutAccount = async (
	{ account_name }: { account_name: string },
) => {
	const data = await (await accounts()).insertOne({
		account_name,
		account_id: nanoid(12),
		created_at: new Date(Date.now()).toUTCString(),
		updated_at: new Date(Date.now()).toUTCString(),
	});

	return data;
};
