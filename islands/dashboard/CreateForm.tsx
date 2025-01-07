import { Data } from "../../routes/dashboard/create/index.tsx";
import Input from "../../ui/Input.tsx";
import { useState } from "preact/hooks";

type CreateFormProps = {
	userData: Data;
};

export default function CreateForm({ userData }: CreateFormProps) {
	const [loading, setLoading] = useState(false);

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		setLoading(true);
		const formData = new FormData(event.target as HTMLFormElement);
		console.log(formData);

		try {
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			class="rounded-3xl bg-surfaceContainer p-4 w-11/12 mx-auto text-onSecondaryContainer mt-24 max-w-3xl flex flex-col gap-4"
			onSubmit={handleSubmit}
		>
			<h2 class="font-semibold text-size5">Create Record</h2>
			<label class="text-subhead-medium" htmlFor="payer">
				Select Payer Account:
			</label>
			<select class="px-4 py-2 rounded-lg" id="payer" name="payer">
				{userData.accounts.map((account) => (
					<option value={account.id} id={account.id}>{account.Name}</option>
				))}
			</select>

			<label htmlFor="payee">Select Payee</label>
			<select
				class="text-subhead-medium px-4 py-2 rounded-md"
				id="payee"
				name="payee"
			>
				<option>dummy</option>
			</select>

			<label htmlFor="amount">Enter amount</label>
			<Input name="amount" id="amount" />
			<label>Status</label>
			<select class="px-4 py-2 rounded-md text-subhead-medium" name="status">
				<option>PENDING</option>
			</select>
			<button
				type="submit"
				class="bg-tertiary text-onTertiary px-4 py-2 rounded-md"
				disabled={loading}
			>
				{loading ? "loading..." : "Create"}
			</button>
		</form>
	);
}
