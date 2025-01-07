import { Handlers, PageProps } from "$fresh/server.ts";
import { GetAccounts } from "../../../db/Accounts.ts";
import CreateForm from "../../../islands/dashboard/CreateForm.tsx";
import { Account } from "../../../types.ts";

export type Data = {
	accounts: Account[];
};

export const handler: Handlers = {
	async GET(_req, ctx) {
		const accounts = await GetAccounts();

		const data = { accounts: accounts ?? [] } satisfies Data;

		return ctx.render(data);
	},
};

export default function Create({ data }: PageProps<Data>) {
	return (
		<div class="max-w-screen-xl mx-auto p-4">
			<CreateForm userData={data} />
		</div>
	);
}
