import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "ketu";
import { QueryBills } from "@db/Bills.ts";
import Input from "@components/Input.tsx";
import Badge from "@components/atoms/badge.tsx";
import { billStatusBadgeMap } from "@utils/constants.ts";
import { NoData } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";
import Pagination from "@islands/dashboard/bills/Pagination.tsx";
import { BillDocument } from "@/types.ts";
import { bills } from "@repositories/repos.ts";

type Data = {
	bills: BillDocument[];
	paginationInfo: {
		total_count: number;
		page: number;
		limit: number;
	};
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const limit = +(ctx.url.searchParams.get("limit") || 10);
		const vendor_id = ctx.url.searchParams.get("vendor_id") || "";
		const page = +(ctx.url.searchParams.get("page") || 1);

		const searchTerm = ctx.url.searchParams.get("search_term");
		if (searchTerm) {
			const data = await bills.SearchBill(searchTerm);
			return ctx.render(
				{
					bills: data,
					paginationInfo: {
						limit: data.length,
						page,
						total_count: data.length,
					},
				} satisfies Data,
			);
		}
		const data = await QueryBills({ limit, vendor_id, page });
		const total_count = await bills.GetDocumentsCount();

		return ctx.render(
			{
				bills: data,
				paginationInfo: { limit, page, total_count },
			} satisfies Data,
		);
	},
};

export default function Bills({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Bills</h1>

			<div class="flex my-8">
				<form method="GET" class="flex gap-4">
					<Input
						type="search"
						placeholder="search"
						name="search_term"
						autofocus
					/>
					<Button className={buttonVariants({ variant: "outline" })}>
						Search
					</Button>
				</form>

				<div class="ml-auto">
					<Button
						as="a"
						href="/dashboard/bills/create"
						class={buttonVariants({
							variant: "filled",
							className: "inline-flex items-center",
						})}
					>
						Create
					</Button>
				</div>
			</div>

			<section>
				<p className="my-4">
					Found {data.paginationInfo.total_count} results
				</p>
				<div class="rounded-xl overflow-hidden relative border">
					<table class="table-auto w-full border-collapse">
						<thead>
							<tr>
								<th class="px-4 py-2 bg-surfaceContainer text-left">
									Bill Number
								</th>
								<th class="px-4 py-2 bg-surfaceContainer text-left">Vendor</th>
								<th class="px-4 py-2 bg-surfaceContainer text-left">
									Bill Date
								</th>
								<th class="px-4 py-2 bg-surfaceContainer text-left">
									Due Date
								</th>
								<th class="px-4 py-2 bg-surfaceContainer text-left">Amount</th>
								<th class="px-4 py-2 bg-surfaceContainer text-left">Status</th>
							</tr>
						</thead>
						<tbody>
							{!data.bills.length && (
								<tr className="min-h-60">
									<td colspan={7}>
										<div className="flex flex-col items-center justify-center my-8">
											<NoData width={128} height={128} />
											<p className="text-center">No Data</p>
										</div>
									</td>
								</tr>
							)}
							{data.bills.length > 0 && data.bills.map((bill) => {
								return (
									<tr
										class="even:bg-surfaceContainerLow/60 bg-surfaceContainerLowest hover:bg-tertiaryContainer/20"
										key={bill.bill_id}
									>
										<td class="px-4 py-2 text-label-large">
											<a href={`/dashboard/bills/${bill.bill_id}`}>
												{bill.bill_id}
											</a>
										</td>
										<td class="px-4 py-2 text-label-large">
											<a
												href={`/dashboard/vendors/${bill.vendor_id}`}
												class="hover:underline"
											>
												{bill.vendor_name}
											</a>
										</td>
										<td class="px-4 py-2 text-label-large">
											{new Date(bill.created_at).toLocaleString()}
										</td>
										<td class="px-4 py-2 text-label-large">
											{new Date(bill.updated_at).toLocaleString()}
										</td>
										<td class="px-4 py-2 text-label-large">
											{Number(bill.amount).toLocaleString("en-IN")}
										</td>
										<td class="px-4 py-2 text-label-large">
											<Badge
												variant={billStatusBadgeMap[bill.status].variant}
												text={billStatusBadgeMap[bill.status].text}
												className="w-24 text-center"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<Pagination
					currentPage={data.paginationInfo.page}
					total={data.paginationInfo.total_count}
					limit={data.paginationInfo.limit}
				/>
			</section>
		</div>
	);
}
