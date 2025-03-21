import { Handlers, PageProps } from "$fresh/server.ts";
import Badge from "../../../components/atoms/badge.tsx";
import { GetBillFromId } from "../../../db/Bills.ts";

type Data = {
	bill: Awaited<ReturnType<typeof GetBillFromId>>;
};

export const handler: Handlers = {
	async GET(_req, ctx) {
		const { id } = ctx.params;

		const bill = await GetBillFromId(id);

		return ctx.render({ bill });
	},
};

const badgeTypeStatusMap = {
	"PENDING": "warning",
	"IN_PAYMENT": "neutral",
	"PAID": "success"
} as const;

export default function Bill({ params, data }: PageProps<Data>) {
	return (
		<main className="p-6">
			<section>
				<h1 class="text-headline-medium">
					Bill<span className={"text-surfaceTint text-title-medium ml-2"}>
						#{params.id}
					</span>
				</h1>
			</section>

			{data.bill?._id
				? (
					<section className={"mt-6"}>
						<Badge variant={badgeTypeStatusMap[data.bill.status]} text={data.bill.status} className="w-24 text-center"/>
						<p>
							Vendor:{" "}
							<a
								href={`/dashboard/vendors/${data.bill.vendor_id}`}
								className={"text-primary hover:underline active:text-tertiary"}
							>
								{data.bill.vendor_name}
							</a>
						</p>
						<p>Date: {new Date(data.bill.created_at).toLocaleString()}</p>
					</section>
				)
				: <section></section>}
		</main>
	);
}
