import { PageProps } from "fresh";
import { Button } from "ketu";
import { NoData } from "../../../components/icons/index.tsx";
import { AccountDocument, GetAllAccounts } from "../../../db/Accounts.ts";
import { buttonVariants } from "../../../components/Button.tsx";

type Data = {
	accounts: AccountDocument[];
};

export default async function Accounts() {
	const accounts = await GetAllAccounts();

	return (
		<div class="p-4">
			<h1 class="text-display-medium">Accounts</h1>
			<p class="text-headline-small">User owned accounts</p>

			<div class="my-4">
				<Button
					as="a"
					className={buttonVariants({ variant: "filled" })}
					href="/dashboard/accounts/create"
				>
					Create
				</Button>
			</div>

			{accounts && accounts.length
				? (
					<div class="rounded-xl overflow-hidden relative mt-8 border">
						{accounts.map((account) => (
							<p key={account._id}>{account.account_name}</p>
						))}
					</div>
				)
				: (
					<div className="flex gap-4 flex-col items-center justify-center rounded-xl overflow-hidden relative mt-8 border min-h-60">
						<NoData width={128} height={128} />
						<p className="text-center">No Data</p>
					</div>
				)}
		</div>
	);
}
