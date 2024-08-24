import { turso } from "../utils/db.ts";

export type Users = {
	email_id: string;
}

export const getUsers = async () => {
	const result = await turso.execute("SELECT * FROM Users");

	return result;
}
