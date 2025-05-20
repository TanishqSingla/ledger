import { HttpError, PageProps } from "fresh";
import Badge from "@components/atoms/badge.tsx";
import { GetBillFromId } from "@db/Bills.ts";
import AddBillPayment from "../../../islands/dashboard/bills/AddBillPayment.tsx";
import { getFile } from "@queries/s3.ts";
import { billStatusBadgeMap } from "@utils/constants.ts";

type Data = {
	bill: Awaited<ReturnType<typeof GetBillFromId>>;
	file?: string;
	payments: Record<string, string>;
};

export default async function Bill(props: PageProps) {
	const { id } = props.params;

	const bill = await GetBillFromId(id);
	if (!bill) {
		throw new HttpError(404);
	}

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

	return (
		<main className="p-6 h-full w-full overflow-y-auto">
			<section>
				<h1 class="text-headline-medium">
					Bill<span className="text-surfaceTint text-title-medium ml-2">
						#{id}
					</span>
				</h1>
			</section>

			<section className="mt-6">
				{bill.bill_id
					? (
						<>
							<Badge
								variant={billStatusBadgeMap[bill.status].variant}
								text={billStatusBadgeMap[bill.status].text}
								className="w-24 text-center"
							/>
							<p>
								Vendor:{" "}
								<a
									href={`/dashboard/vendors/${bill.vendor_id}`}
									className="text-primary hover:underline active:text-tertiary"
								>
									{bill.vendor_name}
								</a>
							</p>{" "}
							<p>Date: {new Date(bill.created_at).toLocaleString()}</p>
							<embed
								src={file}
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

				{bill?.payments?.map((payment) => {
					return (
						<>
							{payment.file && (
								<embed src={payments[payment.file]} type="text/plain" />
							)}
							{payment.reference_number && <p>{payment.reference_number}</p>}
						</>
					);
				})}

				<AddBillPayment billId={id} />
			</section>

			<hr />
			{bill?.history && (
				<section>
					<h2>History</h2>
					<ul>
						{bill.history.map((item, index) => {
							return <li key={index}>{item.action} by {item.user}</li>;
						})}
					</ul>
				</section>
			)}
		</main>
	);
}
