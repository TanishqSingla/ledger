import { MongoClient } from "mongodb";

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("DB_NAME");

if (!MONGODB_URI) {
	console.error("MONGODB_URI not found");
	Deno.exit(1);
}

export const getDB = async () => {
	const client = new MongoClient(MONGODB_URI);

	try {
		await client.db("admin").command({ ping: 1 });
		return client.db(DB_NAME);
	} catch (err) {
		console.error(err);
		Deno.exit(1);
	}
};

export const vendors = async () => {
	const db = await getDB();

	return db.collection("vendors");
};

export const bills = async () => {
	const db = await getDB();

	return db.collection("bills");
};

export const accounts = async () => {
	const db = await getDB();

	return db.collection("accounts");
};
