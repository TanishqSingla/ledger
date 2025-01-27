import { KV_KEYS } from "../utils/constants.ts";
import { kv } from "../utils/db.ts";

export type User = {
	email_id: string;
};

export const getUsers = async () => {
	const { value } = await kv.get<User[]>([KV_KEYS.USERS]);

	return value;
};

export const findUser = async (email: string): Promise<User | null> => {
	const { value } = await kv.get<User[]>(["users"]);

	if (!value) return null;

	const user = value.find((user) => user.email_id === email);
	if (!user) return null;

	return user;
};
