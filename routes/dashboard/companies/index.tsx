import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "ketu";
import { NoData } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { company } from "@repositories/repos.ts";
import { CompanyDocument } from "@/types.ts";

type Data = {
	companies: CompanyDocument[];
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const companies = await company.GetAll();

		return ctx.render({ companies } satisfies Data);
	},
};

export default function Accounts({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Companies</h1>
			<p class="text-title-medium">Manage your companies</p>

			<div class="my-4">
				<Button
					as="a"
					className={buttonVariants({ variant: "filled" })}
					href="/dashboard/companies/create"
				>
					Create
				</Button>
			</div>

			{data.companies.length
				? (
					<div class="rounded-xl overflow-hidden relative mt-8 border">
						{data.companies.map((company) => (
							<p key={company.company_id}>{company.company_name}</p>
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
