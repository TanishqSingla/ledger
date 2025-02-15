import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "ketu";
import { QueryBills } from "../../../db/Bills.ts";
import Input from "../../../components/Input.tsx";

type Data = {
	bills: {
		bill_number: string;
		vendor: string;
		vendor_id: string;
		bill_date: string;
		due_date: string;
		amount: number;
		status: string;
	}[];
};

export const handler: Handlers = {
	GET: async function (req, ctx) {
		const data = await QueryBills({});

		return ctx.render({ bills: data });
	},
};

export default function Bills({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-medium">Bills</h1>

			<div class="flex my-8">
				<div class="flex gap-4">
					<Input type="search" placeholder={"search"} autofocus />
					<Button class="text-tertiary border border-tertiary px-4 py-2 rounded-xl hover:bg-tertiary hover:text-onTertiary transition">
						Search
					</Button>
				</div>

				<div class="ml-auto">
					<Button as="a" href="/dashboard/bills/create" class="bg-tertiary text-onTertiary px-4 py-2 rounded-xl">
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
						{data.bills.map((bill) => {
							return (
								<tr
									class="even:bg-surfaceContainerLow/60 bg-surfaceContainerLowest hover:bg-surfaceContainerHigh"
									key={bill.bill_date}
								>
									<td class="px-4 py-2 text-label-large">
										<a href={`/dashboard/bills/${bill.bill_number}`}>
											{bill.bill_number}
										</a>
									</td>
									<td class="px-4 py-2 text-label-large">
										<a
											href={`/dashboard/vendors/${bill.vendor_id}`}
											class="hover:underline"
										>
											{bill.vendor}
										</a>
									</td>
									<td class="px-4 py-2 text-label-large">{bill.bill_date}</td>
									<td class="px-4 py-2 text-label-large">{bill.due_date}</td>
									<td class="px-4 py-2 text-label-large">
										{Number(bill.amount).toLocaleString("en-IN")}
									</td>
									<td class="px-4 py-2 text-label-large">{bill.status}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
