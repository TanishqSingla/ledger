import { Handlers, PageProps } from "$fresh/server.ts";
import Badge from "../../../components/atoms/badge.tsx";
import { type Bill, GetBillFromId } from "../../../db/Bills.ts";
import { getFile } from "../../../queries/s3.ts";
import { billStatusBadgeMap } from "../../../utils/constants.ts";

type Data = {
	bill: Awaited<ReturnType<typeof GetBillFromId>>;
	file?: string;
};

export const handler: Handlers = {
	async GET(_req, ctx) {
		const { id } = ctx.params;

		const bill = await GetBillFromId(id) as Bill;

		let file;
		if (bill?.invoices?.length) {
			const fileId = bill.invoices[0];

			const downloadedFile = await getFile(fileId);
			file = downloadedFile;
		}
		return ctx.render({ bill, file });
	},
};

export default function Bill({ params, data }: PageProps<Data>) {
	return (
		<main className="p-6 h-full w-full overflow-y-auto">
			<section>
				<h1 class="text-headline-medium">
					Bill<span className={"text-surfaceTint text-title-medium ml-2"}>
						#{params.id}
					</span>
				</h1>
			</section>

			<section className={"mt-6"}>
				{data.bill?._id
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
									className={"text-primary hover:underline active:text-tertiary"}
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
							>
							</embed>
						</>
					)
					: <></>}
			</section>
		</main>
	);
}
