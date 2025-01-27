import { Handlers, PageProps } from "$fresh/server.ts";
import Dashboard from "../../islands/dashboard/index.tsx";
import { Account } from "../../types.ts";
import { GetAllAccounts } from "../../db/Transactions.ts";

export type Data = {
	email_id: string;
	accounts: Account[];
	filters: {
		accountId: string;
		status: string;
		accountNo: string;
	};
};

export const handler: Handlers = {
	async GET(req, ctx) {
		const data = {
			email_id: ctx.state.email_id,
		};

		const url = new URL(req.url);
		const filters = {
			accountId: url.searchParams.get("account"),
			status: url.searchParams.get("status"),
			accountNo: url.searchParams.get("account-no"),
		} as Data["filters"];
		Object.assign(data, { filters });

		const accounts = await GetAllAccounts();

		if (data) {
			Object.assign(data, { accounts: accounts || [] });
		}

		return ctx.render(data);
	},
};

export default function DashboardPage({ data }: PageProps<Data>) {
	return (
		<section class="max-w-screen-xl mx-auto">
			<form
				method="GET"
				class="bg-primaryContainer rounded-lg p-4 flex flex-wrap items-center gap-4 my-4 w-full"
			>
				<label htmlFor="account">Account:</label>
				<select
					id="account"
					name="account"
					class="px-4 py-2 rounded-lg"
					defaultValue={data.filters.accountId}
				>
					<option value="all">All</option>
					{data.accounts.flatMap((account) =>
						account.IsUserOwned
							? (
								<option value={account.pk} id={account.pk}>
									{account.BankDetails.AccountName}
								</option>
							)
							: []
					)}
				</select>

				<label htmlFor="status">Status:</label>
				<select
					id="status"
					name="status"
					class="px-4 py-2 rounded-lg"
					defaultValue={data.filters.status}
				>
					<option value="all">All</option>
					<option value="dummy">Pending</option>
					<option value="dummy1">Completed</option>
					<option value="dummy2">Blocked</option>
				</select>

				<button
					type="submit"
					class="bg-tertiary text-onTertiary rounded-md px-4 py-2 ml-auto"
				>
					Apply Filter
				</button>
			</form>

			<div class="my-4 bg-surfaceContainerHighest rounded-md p-4">
				<Dashboard filters={data.filters} />
			</div>

			<a
				href="/dashboard/create"
				class="text-onTertiary bg-tertiary rounded-md px-4 py-2"
			>
				+ create
			</a>
		</section>
	);
}
