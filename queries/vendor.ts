import { Vendor, VendorDocument } from "../db/Vendors.ts";

export type PutVendorPayload = {
	vendor_name: string;
	email?: string;
	phone?: string;
};

export const putVendor = async (body: PutVendorPayload) => {
	const response = await fetch("/api/vendor", {
		method: "PUT",
		body: JSON.stringify(body),
	});

	const data: { message: string; data: VendorDocument } = await response.json();

	if (response.status > 400) {
		throw new Error(data.message);
	}

	return data;
};

export const deleteVendor = async (body: { vendor_id: string }) => {
	const response = await fetch("/api/vendor", {
		method: "DELETE",
		body: JSON.stringify(body),
	});

	const data = await response.json();

	if (response.status > 400) {
		throw new Error(data);
	}

	return data;
};

export const addVendorAccount = async (
	{ vendor_id, account }: { vendor_id: string; account: Vendor["accounts"][0] },
) => {
	const response = await fetch(`/api/vendor/${vendor_id}/accounts`, {
		method: "PUT",
		body: JSON.stringify(account),
	});

	const data = await response.json();

	if (response.status > 400) {
		throw new Error(data);
	}

	return data;
};

export const deleteVendorAccount = async (
	{ vendor_id, accountId }: { vendor_id: string; accountId: string },
) => {
	const response = await fetch(`/api/vendor/${vendor_id}/accounts`, {
		method: "DELETE",
		body: JSON.stringify({ accountId }),
	});

	const data = await response.json();

	if (response.status > 400) {
		throw new Error(data);
	}

	return data;
};
