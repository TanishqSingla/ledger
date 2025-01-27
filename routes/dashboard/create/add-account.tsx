import { Handlers } from "$fresh/server.ts";
import { AddAccountBody, AddNewAccount } from "../../../db/Transactions.ts";
import AddAccountForm from "../../../islands/dashboard/create/AddAccountForm.tsx";
import { KV_KEYS } from "../../../utils/constants.ts";
import { kv } from "../../../utils/db.ts";

export const handler: Handlers = {
	POST: async function (req, _ctx) {
		const data = await req.json() as AddAccountBody;
		console.log('data -->', data);

		const response = await AddNewAccount(data);
		if (response.$metadata.httpStatusCode === 200) {
			kv.delete([KV_KEYS.ACCOUNTS]);

			return new Response(JSON.stringify({}), { status: 200 });
		}

		return new Response(
			JSON.stringify({ status: "error", message: "Failed to add account" }),
			{ status: 400 },
		);
	},
};

export default function AddAccount() {
	return (
		<div class="p-4 mx-auto max-w-screen-sm">
			<h1 class={"px-2 text-headline-medium font-semibold"}>Add Account</h1>
			<AddAccountForm />
		</div>
	);
}
