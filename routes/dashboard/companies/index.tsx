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

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{data.companies.length
					? (
						<div class="rounded-xl overflow-hidden relative mt-8 border">
							{data.companies.map((company) => (
								<div className="bg-surfaceContainerLow border border-outlineVariant rounded-xl p-4">
									<p className="text-title-large">{company.company_name}</p>

									<p className="text-label-large">
										Date added:{" "}
										{new Date(company.created_at).toLocaleDateString()}
									</p>

									<div className="mt-4 flex gap-4 items-center">
										<Button
											className={buttonVariants({
												variant: "text",
												className: "ml-auto",
											})}
											as="a"
											href={`/dashboard/companies/${company.company_id}`}
										>
											View
										</Button>
									</div>
								</div>
							))}
						</div>
					)
					: (
						<div className="flex flex-col items-center justify-center my-8">
							<NoData width={128} height={128} />
							<p className="text-center">No Data</p>
						</div>
					)}
			</div>
		</div>
	);
}
