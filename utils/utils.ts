export function getFormDataAccounts(formData: FormData) {
	const accounts: Record<string, Record<string, string>> = {};

	for (const [key, value] of formData.entries()) {
		const match = key.match(/(?:account_number|ifsc|branch_name|bank_name)_(\$[A-Za-z0-9-_]+$)/);

		if (match) {
			const [, id] = match;
			if (!accounts[id]) accounts[id] = {};

			if (!accounts[id].id) accounts[id].id = id.replace("$", "");

			accounts[id][key.replace(`_${id}`, "")] = value.toString();
		}
	}
	
	return accounts;
}
