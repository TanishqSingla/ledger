import { useState } from "preact/hooks";
import Input from "../../../components/Input.tsx";
import { type AddAccountBody } from "../../../db/Transactions.ts";

export default function AddAccountForm() {
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		setLoading(true);
		const formData = new FormData(event.target as HTMLFormElement);

		const body = {
			accountName: formData.get("accountName")?.toString().trim()!,
			accountNumber: formData.get("accountNumber")?.toString().trim()!,
			ifsc: formData.get("ifsc")?.toString()!,
			isUserOwned: !!formData.get("isUserOwned"),
		} satisfies AddAccountBody;

		try {
			await fetch("/dashboard/create/add-account", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body)
			});
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
			<label class="text-title-medium my-4 block" htmlFor="accountName">
				Account Name:
				<Input class="text-body-medium" name="accountName" id="accountName" required />
			</label>

			<label class="text-title-medium block" htmlFor="accountNumber">
				Account Number
				<Input
					class="text-body-medium"
					name="accountNumber"
					id="accountNumber"
				/>
			</label>

			<label class="text-title-medium block" htmlFor="ifsc">
				IFSC
				<Input
					class="text-body-medium"
					name="ifsc"
					id="ifsc"
				/>
			</label>

			<label class="text-title-medium block" htmlFor="isUserOwned">
				Owned by user?
				<input
					class="text-body-medium"
					name="isUserOwned"
					id="isUserOwned"
					type="checkbox"
				/>
			</label>

			<div>
				<button
					type="submit"
					class="bg-tertiary text-onTertiary px-4 py-2 rounded-2xl disabled:bg-tertiary/60"
					disabled={loading}
				>
					{loading ? "loading..." : "Add Account"}
				</button>
			</div>
		</form>
	);
}
