import { VendorDocument } from "../db/Vendors.ts";

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
