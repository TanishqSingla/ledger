import { Handlers, PageProps } from "$fresh/server.ts";
import { ArchiveDocument, GetArchiveBillById } from "@db/ArchiveBills.ts";
import ArchiveBillActions from "../../../islands/dashboard/archive-bills/ArchiveBillActions.tsx";

export const handler: Handlers = {
	async GET(_req, ctx) {
		const { archive_id } = ctx.params;
		const archive = await GetArchiveBillById(archive_id);

		return ctx.render({ ...archive });
	},
};

export default function ArchiveBill(
	{ data: archive }: PageProps<ArchiveDocument>,
) {
	return (
		<main className="p-6 h-full w-full overflow-y-auto">
			<section>
				<h1 class="text-headline-medium">
					Archive Bill<span className="text-surfaceTint text-title-medium ml-2">
						#{archive.bill_id}
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

			<ArchiveBillActions archiveId={archive.bill_id} />

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
