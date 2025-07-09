import Input from "@components/Input.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { Handlers } from "$fresh/server.ts";
import { company, CompanyRepository } from "@repositories/repos.ts";
import { getFormDataAccounts } from "@utils/utils.ts";
import { CompanyDocument } from "@/types.ts";
import AddAccountForm from "@islands/molecules/AccountForm.tsx";

export const handler: Handlers = {
	POST: async function (req, ctx) {
		const formData = await req.formData();

		const accounts = getFormDataAccounts(formData);

		const companyDoc = CompanyRepository.NewAccount({
			company_name: formData.get("company_name")!.toString(),
			company_accounts: Object.values(
				accounts,
			) as CompanyDocument["company_accounts"],
		});

		try {
			const resp = await company.InsertOne(companyDoc);

			if (!resp.acknowledged) {
				return Response.json({ error: "Error adding company" }, {
					status: 500,
				});
			}

			return Response.redirect(
				ctx.url.origin + "/dashboard/companies/" + companyDoc.company_id,
			);
		} catch (err) {
			console.log(err);

			return Response.json(err, { status: 500 });
		}
	},
};

export default function Create() {
	return (
		<main className="max-w-screen-sm mx-auto p-4">
			<h1 class="text-display-small">Add Company</h1>

			<form className="p-4 rounded-xl" method="POST">
				<div className="my-4">
					<label class="text-label-large">
						Company Name
						<Input
							placeholder="Company Name"
							name="company_name"
							required
						/>
					</label>
				</div>

				<AddAccountForm />

				<div class="flex items-center justify-end gap-2">
					<button
						type="submit"
						class={buttonVariants({ variant: "secondary" })}
					>
						Create
					</button>
				</div>
			</form>
		</main>
	);
}
