import { Handlers, PageProps } from "$fresh/server.ts";
import { company } from "@repositories/repos.ts";
import { CompanyDocument } from "../../../types.ts";

type Data = {
	company: CompanyDocument;
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const { company_id } = ctx.params;

		const data = await company.GetById(company_id);

		return ctx.render({ company: data });
	},
};

const columnConfig = [
	{ name: "Bank Name" },
	{ name: "Branch Name" },
	{ name: "Account Number" },
	{ name: "IFSC" },
];

export default function Company({ data }: PageProps<Data>) {
	return (
		<main class="p-4">
			<h1 class="text-display-small">
				{data.company.company_name}
			</h1>

			<section>
				<p className="text-title-medium">Accounts</p>

				<table class="table-auto w-full border-collapse">
					<thead>
						<tr>
							{columnConfig.map((col) => (
								<th className="px-4 py-2 bg-surfaceContainer text-left">
									{col.name}
								</th>
							))}

							<th class="px-4 py-2 bg-surfaceContainer text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{data.company.company_accounts.map((account) => (
							<tr className="even:bg-surfaceContainerLow/60 bg-surfaceContainerLowest hover:bg-tertiaryContainer/20">
								<td class="px-4 py-2 text-label-large">
									{account.bank_name}
								</td>
								<td class="px-4 py-2 text-label-large">
									{account.branch_name}
								</td>
								<td class="px-4 py-2 text-label-large">
									{account.account_number}
								</td>
								<td class="px-4 py-2 text-label-large">{account.ifsc}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</main>
	);
}
