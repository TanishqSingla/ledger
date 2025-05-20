import Input from "../../../components/Input.tsx";
import { buttonVariants } from "../../../components/Button.tsx";
import { PutAccount } from "../../../db/Accounts.ts";
import { HandlerByMethod } from "fresh";

export const handler: HandlerByMethod<unknown, unknown> = {
	POST: async function (ctx) {
		const req = ctx.req;
		const formData = await req.formData();

		const resp = await PutAccount({
			account_name: formData.get("account_name")!.toString(),
		});

		return { data: {} };
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
