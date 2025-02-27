import { Handlers, PageProps } from "$fresh/server.ts";
import { AccountDocument, GetAllAccounts } from "../../../db/Accounts.ts";

type Data = {
	accounts: AccountDocument[];
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const accounts = await GetAllAccounts();

		return ctx.render({ accounts });
	},
};

export default function Accounts({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Accounts</h1>
			<p class="text-headline-small">User owned accounts</p>

			<div class="my-4">
				<a
					href="/dashboard/accounts/create"
					class="rounded-lg bg-primary px-4 py-2 text-onPrimary"
				>
					Create
				</a>
			</div>

			<div class="rounded-xl overflow-hidden relative mt-8 border">
				{data.accounts.map((account) => <p>{account.account_name}</p>)}
			</div>
		</div>
	);
}
