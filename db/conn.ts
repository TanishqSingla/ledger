import { MongoClient } from "mongodb";

const MONGODB_URI = Deno.env.get("MONGODB_URI");
const DB_NAME = Deno.env.get("DB_NAME");

if (!MONGODB_URI) {
	console.error("MONGODB_URI not found");
	Deno.exit(1);
}

const client = new MongoClient(MONGODB_URI);

try {
	await client.db("admin").command({ ping: 1 });
} catch (err) {
	console.error(err);
	Deno.exit(1);
}

export const db = client.db(DB_NAME);
export const vendors = db.collection("vendors");
export const bills = db.collection("bills");
