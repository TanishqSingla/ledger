import { useEffect, useRef } from "preact/hooks";
import { CircleUserRound } from "@components/icons/index.tsx";

export default function ProfileDropdown() {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const observer = new ResizeObserver((_entries) => {
			if (!dialogRef.current || !triggerRef.current) return;

			dialogRef.current.style.top =
				triggerRef.current.getBoundingClientRect().bottom + "px";

			dialogRef.current.style.left =
				triggerRef.current.getBoundingClientRect().left + "px";

			if (
				dialogRef.current.getBoundingClientRect().right > globalThis.screenX
			) {
				dialogRef.current.style.left =
					triggerRef.current.getBoundingClientRect().left -
					(dialogRef.current.getBoundingClientRect().width / 2) + "px";
			}
		});

		observer.observe(document.body);
		observer.observe(dialogRef.current!);

		return () => {
			observer.unobserve(document.body);
			observer.unobserve(dialogRef.current!);
		};
	}, []);

	return (
		<div className="relative">
			<button
				type="button"
				ref={triggerRef}
				onClick={() => dialogRef.current?.showModal()}
				aria-label="profile button"
			>
				<CircleUserRound />
			</button>
			<dialog
				ref={dialogRef}
				className="m-0 bg-surfaceContainerLow rounded-xl backdrop:bg-transparent shadow -translate-x-1/4"
				is="modal-dialog"
			>
				<div className="flex flex-col">
					<a
						href="/profile"
						className="cursor-pointer hover:bg-surfaceContainerHigh px-4 py-2"
					>
						Profile
					</a>
					<a
						className="cursor-pointer hover:bg-surfaceContainerHigh px-4 py-2"
						href="/logout"
					>
						Logout
					</a>
				</div>
			</dialog>
		</div>
	);
}
