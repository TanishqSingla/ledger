import { useEffect, useRef } from "preact/hooks";
import { CircleUserRound } from "../../components/icons/index.tsx";

export default function ProfileDropdown() {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const handleOutsideClick = (event: MouseEvent) => {
		const rect = dialogRef.current?.getBoundingClientRect()!;
		const outsideDialog = event.clientY <= rect.top ||
			event.clientX <= rect.left || event.clientX >= rect.right ||
			event.clientY >= rect.bottom;

		if (outsideDialog) dialogRef.current?.close();
	};

	useEffect(() => {
		const observer = new ResizeObserver((_entries) => {
			if (!dialogRef.current || !triggerRef.current) return;

			dialogRef.current.style.top =
				triggerRef.current.getBoundingClientRect().bottom + "px";

			dialogRef.current.style.left =
				triggerRef.current.getBoundingClientRect().left + "px";

			if (dialogRef.current.getBoundingClientRect().right > window.screenX) {
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
		<div className={"relative"}>
			<button
				ref={triggerRef}
				onClick={() => dialogRef.current?.showModal()}
				aria-label={"profile button"}
			>
				<CircleUserRound />
			</button>
			<dialog
				ref={dialogRef}
				className={`m-0 bg-surfaceContainerLow rounded-xl backdrop:bg-transparent shadow -translate-x-1/4`}
				onClick={handleOutsideClick}
			>
				<div className={'flex flex-col'}>
					<button
						className={"cursor-pointer hover:bg-surfaceContainerHigh px-4 py-2"}
					>
						Profile
					</button>
					<a
						className={"cursor-pointer hover:bg-surfaceContainerHigh px-4 py-2"}
						href={"/logout"}
					>
						Logout
					</a>
				</div>
			</dialog>
		</div>
	);
}
