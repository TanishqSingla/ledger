import useInvoice from "@hooks/bills/useInvoice.ts";
import { TrashIcon } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { twMerge } from "tailwind-merge";
import type { BillDocument } from "@/types.ts";

export default function Invoices(
	{ bill, invoices }: { bill: BillDocument; invoices: Record<string, string> },
) {
	const { data, deleteInvoice } = useInvoice(bill.invoices || null);

	const handleDelete = (invoice: string) => {
		console.log(invoice);
		deleteInvoice.mutate({ billId: bill.bill_id, invoice });
	};

	return (
		<div>
			{data?.value?.map((value) => (
				<div
					className="flex justify-between items-center px-4 py-2"
					key={value}
				>
					<a className="text-primary hover:underline" href={invoices[value]}>
						File {value}
					</a>
					<button
						type="button"
						className={twMerge(buttonVariants({
							variant: "text",
							className: "text-error",
						}))}
						onClick={() => handleDelete(value)}
					>
						<TrashIcon />
					</button>
				</div>
			))}
		</div>
	);
}
