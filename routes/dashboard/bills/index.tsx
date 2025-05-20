import { PageProps } from "fresh";
import { Button } from "ketu";
import { BillDocument, QueryBills, SearchBills } from "@db/Bills.ts";
import Input from "@components/Input.tsx";
import Badge from "@components/atoms/badge.tsx";
import { billStatusBadgeMap } from "@utils/constants.ts";
import { NoData } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";

export default async function Bills(props: PageProps) {
	const limit = +(props.url.searchParams.get("limit") || 50);
	const vendor_id = props.url.searchParams.get("vendor_id") || "";
	const searchTerm = props.url.searchParams.get("search_term");

	const bills: BillDocument[] = [];
	if (searchTerm) {
		const data = await SearchBills({ query: searchTerm });
		Object.assign(bills, data);
	} else {
		const data = await QueryBills({ limit, vendor_id });
		Object.assign(bills, data);
	}

	return (
		<div class="p-4">
			<h1 class="text-display-medium">Bills</h1>

			<div class="flex my-8">
				<form method="GET" class="flex gap-4">
					<Input
						type="search"
						placeholder="search"
						name="search_term"
						defaultValue={searchTerm || ""}
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
			<div class="rounded-xl overflow-hidden relative mt-8 border">
				<table class="table-auto w-full border-collapse">
					<thead>
						<tr>
							<th class="px-4 py-2 bg-surfaceContainer text-left">
								Bill Number
							</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Vendor</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Bill Date</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Due Date</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Amount</th>
							<th class="px-4 py-2 bg-surfaceContainer text-left">Status</th>
						</tr>
					</thead>
					<tbody>
						{!bills.length && (
							<tr className="min-h-60">
								<td colspan={7}>
									<div className="flex flex-col items-center justify-center my-8">
										<NoData width={128} height={128} />
										<p className="text-center">No Data</p>
									</div>
								</td>
							</tr>
						)}
						{bills.length > 0 && bills.map((bill) => {
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
									<td class="px-4 py-2 text-label-large">{bill.created_at}</td>
									<td class="px-4 py-2 text-label-large">{bill.created_at}</td>
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
		</div>
	);
}
