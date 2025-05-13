import { MongoClient } from "mongodb";
import { ArchiveDocument } from "./ArchiveBills.ts";
import { BillDocument } from "./Bills.ts";
import { VendorDocument } from "./Vendors.ts";

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("DB_NAME");

if (!MONGODB_URI) {
	console.error("MONGODB_URI not found");
	Deno.exit(1);
}

export const getClient = async () => {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.db("admin").command({ ping: 1 });
		return client;
	} catch (err) {
		console.error(err);
		Deno.exit(1);
	}
};

export const vendors = async () => {
	const db = (await getClient()).db(DB_NAME);

	return db.collection<VendorDocument>("vendors");
};

export const bills = async () => {
	const db = (await getClient()).db(DB_NAME);

	return db.collection<BillDocument>("bills");
};

export const archiveBills = async () => {
	const db = (await getClient()).db(DB_NAME);

	return db.collection<ArchiveDocument>("archive_bills");
};

export const accounts = async () => {
	const db = (await getClient()).db(DB_NAME);

	return db.collection("accounts");
};
