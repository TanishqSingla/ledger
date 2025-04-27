export const uploadFileApi = async (file: File) => {
	const fileFormData = new FormData();
	fileFormData.append("invoices", file, file.name);

	const response = await fetch("/api/s3", {
		method: "PUT",
		body: fileFormData,
	});

	const data = await response.json();

	return data;
};
