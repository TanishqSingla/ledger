import usePayment from "@hooks/bills/usePayment.ts";
import { Bill } from "@db/Bills.ts";
import { NoData, TrashIcon } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";

const columnConfig = [
	{ name: "Reference number" },
	{ name: "To Account" },
	{ name: "Attachments" },
	{ name: "Actions" },
];

export default function PaymentsTable(
	{ billId, payments }: { billId: string; payments: Bill["payments"] },
) {
	const { data, deletePayment } = usePayment(payments);

	const handleDelete = (payment: Required<Bill>["payments"][0]) => {
		deletePayment.mutate({ billId, payment });
	};

	return (
		<div class="rounded-xl overflow-hidden relative mt-8 border">
			<table class="table-auto w-full border-collapse">
				<thead>
					<tr>
						{columnConfig.map((col) => (
							<td
								key={col.name}
								class="px-4 py-2 bg-surfaceContainer text-left"
							>
								{col.name}
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{(!data.value || data.value.length == 0) && (
						<tr className="min-h-60">
							<td colspan={7}>
								<div className="flex flex-col items-center justify-center my-8">
									<NoData width={128} height={128} />
									<p className="text-center">No Data</p>
								</div>
							</td>
						</tr>
					)}
					{data.value &&
						data.value.map((payment) => (
							<tr key={payment.reference_number}>
								<td class="px-4 py-2 text-label-large">
									{payment.reference_number}
								</td>
								<td>{payment.vendor_account}</td>
								<td>
									{payment.file
										? <a href={payment.file}>View file</a>
										: "No file attached"}
								</td>
								<td>
									<button
										type="button"
										className={buttonVariants({
											variant: "destructiveOutline",
										})}
										onClick={() => handleDelete(payment)}
									>
										<TrashIcon />
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}
