export const uploadBillInvoice = async (file: File) => {
	const fileFormData = new FormData();
	fileFormData.append("invoice", file, file.name);

	const response = await fetch("/api/bill/invoices", {
		method: "POST",
		body: fileFormData,
	});

	const data = await response.json();

	return data;
};

export const uploadBillPayment = async (billId: string, file: File) => {
	const fileFormData = new FormData();
	fileFormData.append("payment", file, file.name);

	const response = await fetch(`/api/bill/${billId}/payments/images`, {
		method: "POST",
		body: fileFormData,
	});

	if (response.status > 400) {
		throw new Error("Failed to upload payment image");
	}

	const data = await response.json();
	return data;
};
