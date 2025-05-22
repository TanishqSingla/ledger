import { buttonVariants } from "@components/Button.tsx";
import { twMerge } from "tailwind-merge";
import { fetcher } from "@queries/utils.ts";

export default function ArchiveBillActions(
	{ archiveId }: { archiveId: string },
) {
	const handleRestore = async () => {
		const resp = await fetcher.post(`/api/archive/${archiveId}/bill`);

		if (resp.status > 400) {
			return;
		}

		globalThis.location.replace(`/dashboard/bills/${archiveId}`);
	};

	const handleDelete = async () => {
		const resp = await fetcher.delete(`/api/archive/${archiveId}`);

		if (resp.status > 400) {
			return;
		}

		globalThis.location.replace("/dashboard/archive-bills");
	};

	return (
		<section className="space-x-4">
			<h2 className="text-title-medium">Payments</h2>

			<button
				type="button"
				className={twMerge(
					buttonVariants({
						variant: "filled",
						className: "disabled:bg-gray-400",
					}),
				)}
				onClick={handleRestore}
			>
				Restore
			</button>

			<button
				type="button"
				className={buttonVariants({ variant: "destructive" })}
				onClick={handleDelete}
			>
				Delete
			</button>
		</section>
	);
}
