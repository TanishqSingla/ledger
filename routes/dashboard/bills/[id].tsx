import { Handlers, PageProps } from "$fresh/server.ts";
import Badge from "@components/atoms/badge.tsx";
import { GetBillFromId } from "@db/Bills.ts";
import AddBillPayment from "../../../islands/dashboard/bills/AddBillPayment.tsx";
import { getFile } from "@queries/s3.ts";
import { billStatusBadgeMap } from "@utils/constants.ts";
import { MoveToArchive } from "@db/ArchiveBills.ts";
import PaymentsTable from "../../../islands/dashboard/bills/PaymentsTable.tsx";
import Invoices from "../../../islands/dashboard/bills/Invoices.tsx";
import MoveToArchiveDialog from "../../../islands/dashboard/bills/MoveToArchiveDialog.tsx";

type Data = {
	bill: Awaited<ReturnType<typeof GetBillFromId>>;
	invoices: Record<string, string>;
	payments: Record<string, string>;
};

export const handler: Handlers<unknown, { email_id: string }> = {
	async GET(_req, ctx) {
		const { id } = ctx.params;

		const bill = await GetBillFromId(id);

		const invoices: Record<string, string> = {};
		if (bill?.invoices?.length) {
			const invoiceQueries = await Promise.allSettled(
				bill.invoices.map((invoice) => getFile(invoice)),
			);

			const invoiceFiles = invoiceQueries.filter((query) =>
				query.status === "fulfilled"
			).flatMap((query) => query.value || []);

			bill.invoices.forEach((id, index) => {
				invoices[id] = invoiceFiles[index];
			});
		}

		const paymentFiles =
			bill?.payments?.flatMap((payment) => payment.file || []) || [];

		const paymentQueries = await Promise.allSettled(
			paymentFiles.map((file) => getFile(file)),
		);

		const payments: Data["payments"] = {};
		paymentQueries.forEach((query, index) => {
			if (query.status === "fulfilled" && !!query.value) {
				payments[paymentFiles[index]] = query.value;
			}
		});

		return ctx.render({ bill, invoices, payments } satisfies Data);
	},
	async POST(_req, ctx) {
		const { id } = ctx.params;

		try {
			await MoveToArchive(id, ctx.state.email_id);

			return Response.redirect(
				ctx.url.origin + `/dashboard/archive-bills/${id}`,
				303,
			);
		} catch (err: unknown) {
			console.log(err);
			return ctx.render();
		}
	},
};

export default function Bill({ params, data }: PageProps<Data>) {
	return (
		<main className="p-6 h-full w-full overflow-y-auto">
			<section>
				<h1 class="text-headline-medium">
					Bill<span className="text-surfaceTint text-title-medium ml-2">
						#{params.id}
					</span>
				</h1>
			</section>

			<section className="mt-6">
				{data.bill.bill_id
					? (
						<>
							<Badge
								variant={billStatusBadgeMap[data.bill.status].variant}
								text={billStatusBadgeMap[data.bill.status].text}
								className="w-24 text-center"
							/>
							<p>
								Vendor:{" "}
								<a
									href={`/dashboard/vendors/${data.bill.vendor_id}`}
									className="text-primary hover:underline active:text-tertiary"
								>
									{data.bill.vendor_name}
								</a>
							</p>{" "}
							<p>Date: {new Date(data.bill.created_at).toLocaleString()}</p>
						</>
					)
					: <>Bill not found</>}
			</section>

			<section className="my-4">
				<h2 className="text-title-large">Invoices</h2>
				<Invoices bill={data.bill} invoices={data.invoices} />
			</section>

			<section>
				<h2 className="text-title-large">Payments</h2>

				<div className="my-4">
					<PaymentsTable
						billId={data.bill.bill_id}
						payments={data.bill.payments}
						paymentFiles={data.payments}
					/>
				</div>

				<div className="my-4">
					<AddBillPayment bill={data.bill} />
				</div>
			</section>

			<section>
				<MoveToArchiveDialog label="Move to archive" />
			</section>

			<hr />
			{data.bill?.history && (
				<section>
					<h2>History</h2>
					<ul>
						{data.bill.history.map((item, index) => {
							return <li key={index}>{item.action} by {item.user}</li>;
						})}
					</ul>
				</section>
			)}
		</main>
	);
}
