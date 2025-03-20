export const logout = async () => {
	const response = await fetch("/api/logout");

	if (response.status > 400) {
		throw new Error("Error logging out");
	}

	return response;
};
