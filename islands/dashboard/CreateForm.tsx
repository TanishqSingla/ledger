import Input from "../../components/Input.tsx";
import { useState } from "preact/hooks";
import { Data } from "../../routes/dashboard/create/record.tsx";

type CreateFormProps = {
	data: Data;
};

export default function CreateForm({ data }: CreateFormProps) {
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState<string>("0");

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
			class="px-2 my-4 text-onSecondaryContainer max-w-screen-sm space-y-4"
			onSubmit={handleSubmit}
		>
			<label class="text-title-medium my-4 block">
				Select Payer Account:
				<select class="px-4 py-2 rounded-md w-full block text-body-medium">
					{data.accounts.flatMap((account) => (account.IsUserOwned
						? (
							<option value={account.pk} id={account.pk}>
								{account.AccountName}
							</option>
						)
						: [])
					)}
				</select>
			</label>

			<label class="text-title-medium block">
				Select Payee
				<select
					class="px-4 py-2 rounded-md block w-full text-body-medium"
					name="payee"
				>
					{data.accounts.flatMap((account) => (!account.IsUserOwned
						? (
							<option value={account.pk} id={account.pk}>
								{account.AccountName}
							</option>
						)
						: [])
					)}
				</select>
			</label>

			<label class="text-title-medium block">
				Enter amount
				<Input
					pattern={"^\\d+$"}
					class="text-body-medium"
					value={amount}
					onInput={(e) =>
						setAmount(e.currentTarget.value)}
					onFocus={(e) =>
						e.currentTarget.select()}
				/>
				<span class="ml-2 text-body-small text-onSurface/60">
					₹ {Number.isNaN(+amount)
						? "Invalid number"
						: Intl.NumberFormat("en-in").format(+amount)}
				</span>
			</label>

			<label class="block">
				Status

				<select
					class="px-4 py-2 rounded-md text-body-medium block w-full"
					name="status"
				>
					<option>PENDING</option>
				</select>
			</label>

			<div>
				<button
					type="submit"
					class="bg-tertiary text-onTertiary px-4 py-2 rounded-2xl"
					disabled={loading}
				>
					{loading ? "loading..." : "Create Record"}
				</button>
			</div>
		</form>
	);
}
