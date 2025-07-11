import { twMerge } from "tailwind-merge";
import { buttonVariants } from "@components/Button.tsx";
import { NoData, TrashIcon } from "@components/icons/index.tsx";
import { VendorDocument } from "@/types.ts";
import { useVendorAccounts } from "@hooks/vendor/useVendorAccounts.tsx";

export default function VendorAccountTable(
	{ accounts, vendorId }: {
		accounts: VendorDocument["accounts"];
		vendorId: string;
	},
) {
	const { data, handleDelete } = useVendorAccounts(accounts);

	return (
		<>
			{!data.value.length && (
				<tr className="min-h-60">
					<td colspan={7}>
						<div className="flex flex-col items-center justify-center my-8">
							<NoData width={128} height={128} />
							<p className="text-center">No Accounts added</p>
						</div>
					</td>
				</tr>
			)}
			{data.value.map((account, index) => (
				<tr className="even:bg-surfaceContainerLow/60 bg-surfaceContainerLowest hover:bg-tertiaryContainer/20">
					<td class="px-4 py-2 text-label-large">{index + 1}</td>
					<td class="px-4 py-2 text-label-large">
						{account.bank_name}
					</td>
					<td class="px-4 py-2 text-label-large">
						{account.branch_name}
					</td>
					<td class="px-4 py-2 text-label-large">
						{account.account_number}
					</td>
					<td class="px-4 py-2 text-label-large">{account.ifsc}</td>
					<td class="px-4 py-2 text-label-large">
						<button
							type="button"
							className={twMerge(buttonVariants({
								variant: "link",
								className: "text-error",
							}))}
							onClick={() => handleDelete(vendorId, account.id)}
						>
							<TrashIcon />
						</button>
					</td>
				</tr>
			))}
		</>
	);
}
