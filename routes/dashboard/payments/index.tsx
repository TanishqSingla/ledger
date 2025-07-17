import { Button } from "ketu";
import { buttonVariants } from "@components/Button.tsx";
import { PaymentDocument } from "@/types.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { NoData } from "@components/icons/index.tsx";
import { payments } from "@repositories/repos.ts";
import { useId } from "preact/hooks";

type Data = {
	payments: PaymentDocument[];
};

const columnConfig = [
	{ name: "Reference number" },
	{ name: "Amount" },
	{ name: "Paid to" },
	{ name: "Paid from" },
];

export const handler: Handlers = {
	GET: async (_req, ctx) => {
		const response = await payments.GetAll();

		return ctx.render({ payments: response });
	},
};

export default function Payments({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Payments</h1>

			<div class="ml-auto">
				<Button
					as="a"
					href="/dashboard/payments/create"
					class={buttonVariants({
						variant: "filled",
						className: "inline-flex items-center",
					})}
				>
					Create
				</Button>
			</div>

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
						{(data.payments.length == 0) && (
							<tr className="min-h-60">
								<td colspan={5}>
									<div className="flex flex-col items-center justify-center my-8">
										<NoData width={128} height={128} />
										<p className="text-center">No Data</p>
									</div>
								</td>
							</tr>
						)}
						{data.payments.map((payment) => (
							<tr key={useId()}>
								<td class="px-4 py-2 text-label-large">
									{payment.reference_number}
								</td>
								<td>{payment.amount}</td>
								<td>{payment.paid_to}</td>
								<td>{payment.paid_from}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
