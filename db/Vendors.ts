import { MongoDocument } from "../types.ts";
import { vendors } from "./conn.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export type Vendor = {
	vendor_id: string;
	vendor_name: string;
	email: string;
	phone: string;
};

export type VendorDocument = Vendor & MongoDocument;

export async function GetAllVendors() {
	const resp = (await vendors()).find().toArray();

	return resp;
}

export async function QueryVendors() {
}

export async function DeleteVendor(vendor_id: string) {
	const resp = await (await vendors()).deleteOne({ vendor_id });

	return resp;
}

export async function PutVendor(body: Pick<Vendor, "vendor_name">) {
	const doc = {
		...body,
		vendor_id: nanoid(12),
		created_at: new Date(Date.now()).toUTCString(),
		updated_at: new Date(Date.now()).toUTCString(),
	};

	const resp = await (await vendors()).insertOne(doc);

	return resp;
}

export async function GetVendorFromId(id: string) {
	const resp = (await vendors()).findOne({ vendor_id: id });

	return resp;
}
