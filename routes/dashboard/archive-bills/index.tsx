import { GetArchiveBills } from "@db/ArchiveBills.ts";
import { NoData } from "@components/icons/index.tsx";

const cols = [
	{ name: "Bill Number" },
	{ name: "Bill Date" },
	{ name: "Due Date" },
	{ name: "Amount" },
	{ name: "Archived At" },
	{ name: "Actions" },
];

export default async function ArchiveBills() {
	const archives = await GetArchiveBills();

	return (
		<div class="p-4">
			<h1 class="text-display-medium">Archive bills</h1>

			<div class="rounded-xl overflow-hidden relative mt-8 border">
				<table class="table-auto w-full border-collapse">
					<thead>
						<tr>
							{cols.map((col) => (
								<th
									key={col.name}
									class="px-4 py-2 bg-surfaceContainer text-left"
								>
									{col.name}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{!archives.length && (
							<tr className="min-h-60">
								<td colspan={7}>
									<div className="flex flex-col items-center justify-center my-8">
										<NoData width={128} height={128} />
										<p className="text-center">No Data</p>
									</div>
								</td>
							</tr>
						)}
						{archives.map((archive) => (
							<tr key={archive.bill_id}>
								<td class="px-4 py-2 text-label-large">
									<a href={`/dashboard/archive-bills/${archive.bill_id}`}>
										{archive.bill_id}
									</a>
								</td>
								<td class="px-4 py-2 text-label-large">{archive.created_at}</td>
								<td class="px-4 py-2 text-label-large">{archive.created_at}</td>
								<td class="px-4 py-2 text-label-large">{archive.amount}</td>
								<td class="px-4 py-2 text-label-large">
									{archive.archived_at}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
