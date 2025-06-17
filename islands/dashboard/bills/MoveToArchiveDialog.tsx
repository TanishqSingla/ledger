import { buttonVariants } from "@components/Button.tsx";
import { useRef } from "preact/hooks";
import { CrossIcon } from "@components/icons/index.tsx";

export default function MoveToArchiveDialog({ label }: { label: string }) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const openMoal = () => {
		dialogRef.current?.showModal();
	};

	const handleClose = () => {
		dialogRef.current?.close();
	};

	return (
		<>
			<button
				type="button"
				className={buttonVariants({ variant: "destructive" })}
				onClick={openMoal}
			>
				{label}
			</button>
			<dialog is="modal-dialog" ref={dialogRef} className="rounded-xl">
				<div class="bg-white w-72">
					<div class="flex justify-between px-4 my-4">
						<h1 class="text-title-large">Create vendor</h1>
						<button
							type="button"
							aria-label="Close"
							onClick={handleClose}
						>
							<CrossIcon />
						</button>
					</div>

					<div className="p-4">
						Are you sure you want to move the bill to archive
					</div>

					<form method="post" className="flex gap-2 p-4">
						<button
							type="button"
							className={buttonVariants({ variant: "outline" })}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={buttonVariants({ variant: "destructive" })}
						>
							Confirm
						</button>
					</form>
				</div>
			</dialog>
		</>
	);
}
