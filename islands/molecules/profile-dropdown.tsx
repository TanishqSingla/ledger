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

	const handleNavigation = (event: KeyboardEvent) => {
		if (event.key == "ArrowUp") {
			if (document.activeElement?.previousSibling) {
				(document.activeElement.previousSibling as HTMLElement).focus();
			} else {
				((event.currentTarget as HTMLElement).lastChild as HTMLElement).focus();
			}
		}
		if (event.key == "ArrowDown") {
			if (document.activeElement?.nextSibling) {
				(document.activeElement.nextSibling as HTMLElement).focus();
			} else {
				((event.currentTarget as HTMLDivElement).firstChild as HTMLElement).focus();
			}
		}
	};

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
				<div className="flex flex-col" onKeyDown={handleNavigation}>
					<a
						href="/profile"
						className="cursor-pointer hover:bg-surfaceContainerHigh px-4 py-2 focus-within:bg-surfaceDim focus-within:outline-none"
					>
						Profile
					</a>
					<a
						className="cursor-pointer hover:bg-surfaceContainerHigh px-4 py-2 focus-within:bg-surfaceDim focus-within:outline-none"
						href="/logout"
					>
						Logout
					</a>
				</div>
			</dialog>
		</div>
	);
}
