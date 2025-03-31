import Input from "../../../components/Input.tsx";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "../../../components/Button.tsx";
import { CrossIcon, Loader } from "../../../components/icons/index.tsx";
import { useCallback, useEffect, useRef } from "preact/hooks";
import useVendor from "../../../hooks/vendor/useVendor.ts";

export default function CreateVendorModal() {
	const { createMutation } = useVendor();

	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleOutsideClick = useCallback((event: MouseEvent) => {
		const rect = dialogRef.current?.getBoundingClientRect()!;
		const outsideDialog = event.clientY <= rect.top ||
			event.clientX <= rect.left || event.clientX >= rect.right ||
			event.clientY >= rect.bottom;

		if (outsideDialog) dialogRef.current?.close();
	}, []);

	useEffect(() => {
		dialogRef.current?.addEventListener("click", handleOutsideClick);

		return () => {
			dialogRef.current?.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const body = {
			vendor_name: formData.get("vendor_name") as string,
			...(!!formData.get("email") &&
				{ email: formData.get("email")?.toString() }),
			...(!!formData.get("phone") &&
				{ phone: formData.get("phone")?.toString() }),
		};

		createMutation.mutate(body);
	};

	const handleClose = () => dialogRef.current?.close()

	return (
		<>
			<button
				class={buttonVariants({ variant: "filled" })}
				onClick={() => dialogRef.current?.showModal()}
			>
				Create
			</button>
			<dialog ref={dialogRef} className={"rounded-xl"}>
				<div class="z-20 bg-white max-w-screen-sm">
					<div class="flex justify-between px-4 my-4">
						<h1 class="text-title-large">Create vendor</h1>
						<button
							aria-label={"Close"}
							onClick={handleClose}
						>
							<CrossIcon />
						</button>
					</div>
					<div class="px-4 my-4">
						<form
							onSubmit={handleSubmit}
						>
							<div className={"my-4"}>
								<label htmlFor="vendor_name" class="text-label-large">
									Vendor Name
									<Input
										placeholder="Vendor Name"
										name="vendor_name"
										id="vendor_name"
										required
									/>
								</label>

								<label htmlFor="email" class="text-label-large">
									Vendor Email
									<Input placeholder="Email" id="email" name="email" />
								</label>

								<label htmlFor="phone" class="text-label-large">
									Vendor Phone
									<Input placeholder="Phone" id="phone" name="phone" />
								</label>
							</div>

							<div class="flex items-center justify-end gap-2">
								<button className={buttonVariants({ variant: "text" })} type='button' onClick={handleClose}>
									Cancel
								</button>

								<button
									class={twMerge(
										buttonVariants({ variant: "filled" }),
										(createMutation.isSuccess ||
											createMutation.isError) &&
											buttonVariants({ variant: "outline" }),
									)}
									disabled={createMutation.isLoading}
								>
									{createMutation.isLoading && (
										<span class="mr-1">
											<Loader />
										</span>
									)}
									{createMutation.isError && "Retry?"}
									{createMutation.isSuccess && "Add another"}
									{!createMutation.isError && !createMutation.isSuccess && "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
