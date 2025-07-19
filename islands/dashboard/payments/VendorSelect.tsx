import { signal } from "@preact/signals";
import { VendorDocument } from "@/types.ts";

export const selectedVendor = signal<VendorDocument>();

export function VendorSelect({ vendors }: { vendors: VendorDocument[] }) {
	const handleChange = (event: any) => {
		selectedVendor.value = vendors.find((vendor) =>
			vendor.vendor_id === event.target.value
		);
	};

	return (
		<>
			<select
				name="vendor"
				value={selectedVendor.value?.vendor_id}
				className="block w-full rounded-lg border bg-white p-4"
				onChange={handleChange}
			>
				{vendors.map((vendor) => (
					<option value={vendor.vendor_id}>{vendor.vendor_name}</option>
				))}
			</select>

			{console.log(selectedVendor.value, selectedVendor.value?.accounts)}
			{selectedVendor.value && selectedVendor.value.accounts.length > 0 && (
				<select
					name="account_id"
					className="block w-full rounded-lg border bg-white p-4"
				>
					{selectedVendor.value.accounts.map((account) => (
						<option value={account.id}>
							{account.account_number} {account.branch_name}
						</option>
					))}
				</select>
			)}
		</>
	);
}
