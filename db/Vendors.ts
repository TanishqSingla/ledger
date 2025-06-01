import { MongoDocument } from "../types.ts";
import { vendors } from "./conn.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";

export type Vendor = {
	vendor_id: string;
	vendor_name: string;
	email: string;
	phone: string;
	accounts: {
		id: string;
		bank_name?: string;
		branch_name?: string;
		account_number: string;
		ifsc: string;
	}[];
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

export async function PutVendor(
	body: Pick<Vendor, "vendor_name" | "email" | "phone">,
) {
	const doc = {
		...body,
		vendor_id: nanoid(12),
		created_at: new Date(Date.now()),
		updated_at: new Date(Date.now()),
		accounts: [],
	};

	const resp = await (await vendors()).insertOne(doc);

	return { ...resp, data: doc };
}

export async function GetVendorFromId(id: string) {
	const resp = await (await vendors()).findOne({ vendor_id: id });

	return resp;
}

export async function GetVendorAccounts(vendor_id: string) {
	const resp = await (await vendors()).findOne({ vendor_id }, { projection: { accounts: 1 } });

	return resp;
}

export async function AddAccountToVendor(
	vendor_id: string,
	accounts: Required<Vendor>["accounts"][0],
) {
	const resp = await (await vendors()).updateOne({ vendor_id }, {
		//@ts-ignore: mongo
		"$push": { accounts },
	});

	return resp;
}

export async function DeleteVendorAccount(
	vendor_id: string,
	accountId: string,
) {
	const resp = await (await vendors()).updateOne({ vendor_id }, {
		"$pull": { accounts: { id: accountId } },
	});

	return resp;
}
