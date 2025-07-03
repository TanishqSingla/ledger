import { buttonVariants } from "@components/Button.tsx";
import { twMerge } from "tailwind-merge";
import { fetcher } from "@queries/utils.ts";
import { useRef } from "preact/hooks";

export default function ArchiveBillActions(
	{ archiveId }: { archiveId: string },
) {
	const dialogRef = useRef<HTMLDialogElement>(null);

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
				onClick={() => dialogRef.current?.showModal()}
			>
				Delete
			</button>
			<div className="w-full">
				<dialog
					is="modal-dialog"
					ref={dialogRef}
					className="rounded-xl"
				>
					<div class="bg-white max-w-screen-md rounded-xl">
						<div className="px-4 py-2">
							<h1 className="text-title-large">Permanently delete bill</h1>
						</div>

						<div className="px-4 py-2">
							<p className="text-body-medium">Permanently delete bill</p>
						</div>

						<div className="flex gap-2 px-4 py-2">
							<button
								className={buttonVariants({ variant: "destructive" })}
								type="button"
								onClick={() => dialogRef.current?.close()}
							>
								Close
							</button>
							<button
								className={buttonVariants({ variant: "filled" })}
								type="button"
								onClick={handleDelete}
							>
								Confirm
							</button>
						</div>
					</div>
				</dialog>
			</div>
		</section>
	);
}
