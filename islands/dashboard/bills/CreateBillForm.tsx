import Input from "../../../components/Input.tsx";
import { Bill } from "../../../db/Bills.ts";
import ComboBox, { selectedVendor } from "../../Combobox.tsx";

export default function CreateBillForm() {
	const handleSubmit = async (event: SubmitEvent) => {
		const formData = new FormData(event.target as HTMLFormElement);

		const body = {
			vendor_id: selectedVendor.value?.vendor_id,
			vendor_name: selectedVendor.value?.vendor_name,
			amount: formData.get("amount")?.toString() || 0,
			status:
				(formData.get("status")?.toString() || "PENDING") as Bill["status"],
		};

		try {
			const resp = await fetch("/api/bill", {
				method: "PUT",
				body: JSON.stringify(body),
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form
			class="my-4 text-onSecondaryContainer max-w-screen-sm space-y-4 border border-secondary p-4 rounded-xl"
			onSubmit={handleSubmit}
		>
			<label class="text-title-medium my-4 block" htmlFor="accountName">
				Vendor Name:
				<ComboBox />
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
	);
}
