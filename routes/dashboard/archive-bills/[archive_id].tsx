import { PageProps } from "$fresh/server.ts";
import { GetArchiveBillById } from "@db/ArchiveBills.ts";
import AddBillPayment from "../../../islands/dashboard/bills/AddBillPayment.tsx";

export default async function ArchiveBill({ params }: PageProps) {
	const { archive_id } = params;

	const archive = await GetArchiveBillById(archive_id);

	return (
		<main className="p-6 h-full w-full overflow-y-auto">
			<section>
				<h1 class="text-headline-medium">
					Archive Bill<span className="text-surfaceTint text-title-medium ml-2">
						#{archive_id}
					</span>
				</h1>
			</section>

			<section className="mt-6">
				{archive?.bill_id
					? (
						<>
							<p>
								Vendor:
								<a
									href={`/dashboard/vendors/${archive.vendor_id}`}
									className="text-primary hover:underline active:text-tertiary"
								>
									{archive.vendor_name}
								</a>
							</p>{" "}
							<p>Date: {new Date(archive.created_at).toLocaleString()}</p>
						</>
					)
					: <>Bill not found</>}
			</section>

			<section>
				<h2 className="text-title-medium">Payments</h2>

				<AddBillPayment billId={params.id} />
			</section>

			<hr />
			{archive?.history && (
				<section>
					<h2>History</h2>
					<ul>
						{archive.history.map((item, index) => {
							return <li key={index}>{item.action} by {item.user}</li>;
						})}
					</ul>
				</section>
			)}
		</main>
	);
}
