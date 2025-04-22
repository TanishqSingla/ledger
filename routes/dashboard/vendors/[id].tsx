import { Handlers, PageProps } from "$fresh/server.ts";
import Badge from "../../../components/atoms/badge.tsx";
import { NoData } from "../../../components/icons/index.tsx";
import { BillDocument, QueryBills } from "../../../db/Bills.ts";
import { GetVendorFromId, Vendor } from "../../../db/Vendors.ts";
import { billStatusBadgeMap } from "../../../utils/constants.ts";
import AddVendorAccountModal from "../../../islands/dashboard/vendors/AddVendorAccountModal.tsx";
import { buttonVariants } from "../../../components/Button.tsx";

type Data = {
	vendor: Vendor;
	recentBills: BillDocument[];
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const { id } = ctx.params;

		const queries = await Promise.all([
			GetVendorFromId(id),
			QueryBills({
				limit: 5,
				vendor_id: id,
			}),
		]);

		return ctx.render({ vendor: queries[0], recentBills: queries[1] });
	},
};

const colConfig = [
	{ name: "Bill Number" },
	{ name: "Bill Date" },
	{ name: "Due Date" },
	{ name: "Amount" },
	{ name: "Status" },
];

const accountColConfig = [{ name: "S.No." }, { name: "Bank name" }, {
	name: "Account number",
}, {
	name: "IFSC",
}];

export default function VendorPage({ data, params }: PageProps<Data>) {
	return (
		<main class="p-4">
			<h1 class="text-display-small">
				{data.vendor.vendor_name}
			</h1>

			<section className={""}>
				<p>Id: {data.vendor.vendor_id}</p>
				<p>Email: {data.vendor.email || "-"}</p>
				<p>Phone: {data.vendor.phone || "-"}</p>
			</section>

			<section>
				<p className={"text-title-medium"}>Accounts</p>
				<div className={"rounded-xl overflow-hidden relative border my-4"}>
					<table class="table-auto w-full border-collapse">
						<thead>
							<tr>
								{accountColConfig.map((col) => (
									<th className="px-4 py-2 bg-surfaceContainer text-left">
										{col.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{!data.vendor?.accounts?.length && (
								<tr
									className={"min-h-60"}
								>
									<td colspan={7}>
										<div
											className={"flex flex-col items-center justify-center my-8"}
										>
											<NoData width={128} height={128} />
											<p className={"text-center"}>No Accounts added</p>
										</div>
									</td>
								</tr>
							)}
							{data.vendor?.accounts?.map((account, index) => (
								<tr className="even:bg-surfaceContainerLow/60 bg-surfaceContainerLowest hover:bg-tertiaryContainer/20">
									<td class="px-4 py-2 text-label-large">{index + 1}</td>
									<td class="px-4 py-2 text-label-large">
										{account.bank_name}
									</td>
									<td class="px-4 py-2 text-label-large">
										{account.account_number}
									</td>
									<td class="px-4 py-2 text-label-large">{account.ifsc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<AddVendorAccountModal vendorId={params.id} />
			</section>

			<section>
				<p className={"mt-8 text-title-large"}>Recent Payments</p>
				<div className={"rounded-xl overflow-hidden relative border my-4"}>
					<table class="table-auto w-full border-collapse">
						<thead>
							<tr>
								{colConfig.map((col) => (
									<th className="px-4 py-2 bg-surfaceContainer text-left">
										{col.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{!data.recentBills.length && (
								<tr
									className={"min-h-60"}
								>
									<td colspan={7}>
										<div
											className={"flex flex-col items-center justify-center my-8"}
										>
											<NoData width={128} height={128} />
											<p className={"text-center"}>No Data</p>
										</div>
									</td>
								</tr>
							)}
							{data.recentBills.length > 0 && data.recentBills.map((bill) => {
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
											{bill.created_at}
										</td>
										<td class="px-4 py-2 text-label-large">
											{bill.created_at}
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

				<a
					href={`/dashboard/bills?vendor_id=${params.id}`}
					className={buttonVariants({ variant: "outline" })}
				>
					View All
				</a>
			</section>
		</main>
	);
}
