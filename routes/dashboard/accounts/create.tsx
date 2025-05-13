import Input from "../../../components/Input.tsx";
import { buttonVariants } from "../../../components/Button.tsx";
import { Handlers } from "$fresh/server.ts";
import { PutAccount } from "../../../db/Accounts.ts";

export const handler: Handlers = {
	POST: async function (req, ctx) {
		const formData = await req.formData();

		const resp = await PutAccount({
			account_name: formData.get("account_name")!.toString(),
		});

		return ctx.render();
	},
};

export default function Create() {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Accounts</h1>
			<p class="text-headline-small">Create user owned accounts</p>

			<form
				class="p-4 max-w-screen-lg border border-primary flex flex-col gap-4 rounded-lg"
				method="POST"
			>
				<label>
					Account Name
					<Input name="account_name" required />
				</label>

				<button class={buttonVariants({ variant: "secondary" })}>
					Create
				</button>
			</form>
		</div>
	);
}
