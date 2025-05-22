import { Handlers, PageProps } from "$fresh/server.ts";
import Badge from "@components/atoms/badge.tsx";
import { type Bill, GetBillFromId } from "@db/Bills.ts";
import AddBillPayment from "../../../islands/dashboard/bills/AddBillPayment.tsx";
import { getFile } from "@queries/s3.ts";
import { billStatusBadgeMap } from "@utils/constants.ts";
import { MoveToArchive } from "@db/ArchiveBills.ts";
import { buttonVariants } from "@components/Button.tsx";

type Data = {
	bill: Awaited<ReturnType<typeof GetBillFromId>>;
	file?: string;
	payments: Record<string, string>;
};

export const handler: Handlers<unknown, { email_id: string }> = {
	async GET(_req, ctx) {
		const { id } = ctx.params;

		const bill = await GetBillFromId(id) as Bill;

		let file;
		if (bill?.invoices?.length) {
			const fileId = bill.invoices[0];

			const downloadedFile = await getFile(fileId);
			file = downloadedFile;
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

		return ctx.render({ bill, file, payments });
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
							<embed
								src={data.file}
								width="100%"
								height={600}
								type="text/plain"
							/>
						</>
					)
					: <>Bill not found</>}
			</section>

			<section>
				<h2 className="text-title-medium">Payments</h2>

				{data.bill?.payments?.map((payment) => {
					return (
						<>
							{payment.file && (
								<embed src={data.payments[payment.file]} type="text/plain" />
							)}
							{payment.reference_number && <p>{payment.reference_number}</p>}
						</>
					);
				})}

				<AddBillPayment billId={params.id} />
			</section>

			<section>
				<form method="post">
					<button className={buttonVariants({ variant: "destructive" })}>
						Move to archive
					</button>
				</form>
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
