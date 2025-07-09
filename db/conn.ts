import { Db, MongoClient } from "mongodb";
import { ArchiveDocument } from "./ArchiveBills.ts";
import { BillDocument } from "./Bills.ts";
import { CompanyDocument, PaymentDocument, VendorDocument } from "@/types.ts";

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("DB_NAME");

if (!MONGODB_URI) {
	console.error("MONGODB_URI not found");
	Deno.exit(1);
}
if (!DB_NAME) {
	console.error("DB_NAME not found");
}

class DbClient {
	private client: MongoClient;
	private db: Db;

	constructor(MONGODB_URI: string, DB_NAME: string) {
		this.client = new MongoClient(MONGODB_URI);
		this.db = this.client.db(DB_NAME);
	}

	get Vendors() {
		return this.db.collection<VendorDocument>("vendors");
	}

	get Bills() {
		return this.db.collection<BillDocument>("bills");
	}

	get ArchiveBills() {
		return this.db.collection<VendorDocument>("archive_bills");
	}

	get Companies() {
		return this.db.collection<CompanyDocument>("companies");
	}

	get Payments() {
		return this.db.collection<PaymentDocument>("payments");
	}
}

export const Conn = new DbClient(MONGODB_URI, DB_NAME!);

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
