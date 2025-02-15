import { Handlers } from "$fresh/server.ts";
import Input from "../../../components/Input.tsx";
import ComboBox from "../../../islands/Combobox.tsx";

export const handler: Handlers = {
};

export default function CreateBills() {
	return (
		<div class="p-4">
			<h1 class="text-display-small">Create Bill</h1>

			<form class="my-4 text-onSecondaryContainer max-w-screen-sm space-y-4 border border-secondary p-4 rounded-xl">
				<label class="text-title-medium my-4 block" htmlFor="accountName">
					Vendor Name:
					<ComboBox name={"vendor_name"} />
				</label>

				<label class="text-title-medium block" htmlFor="accountNumber">
					Amount
					<Input
						class="text-body-medium"
						name="amount"
						id="amount"
					/>
				</label>

				<label class="text-title-medium block" htmlFor="isUserOwned">
					Status:
					<select class="px-4 py-2 block rounded-xl bg-surfaceBright w-full">
						<option>Pending</option>
						<option>In Payment</option>
						<option>Paid</option>
					</select>
				</label>

				<div>
					<button
						type="submit"
						class="bg-tertiary text-onTertiary px-4 py-2 rounded-2xl disabled:bg-tertiary/60"
					>
						Add bill
					</button>
				</div>
			</form>
		</div>
	);
}
