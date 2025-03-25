import Input from "../../../components/Input.tsx";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "../../../components/Button.tsx";
import { vendorsSignal } from "./VendorsTable.tsx";
import { CrossIcon, Loader } from "../../../components/icons/index.tsx";
import { useMutation } from "../../../hooks/useMutation.ts";
import { putVendor } from "../../../services/vendor.ts";
import { useCallback, useEffect, useRef } from "preact/hooks";

export default function CreateVendorModal() {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const mutation = useMutation({
		mutationFn: putVendor,
		onSuccess: (data) => {
			vendorsSignal.value = [...vendorsSignal.value, data.data];

			setTimeout(() => {
				mutation.reset();
			}, 3000);
		},
	});

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

		mutation.mutate(body);
	};

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
					<div class="flex justify-between p-4">
						<h1 class="text-title-large">Create vendor</h1>
						<button
							aria-label={"Close"}
							onClick={() => dialogRef.current?.close()}
						>
							<CrossIcon />
						</button>
					</div>
					<hr />
					<div class="p-4">
						<form
							onSubmit={handleSubmit}
						>
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

							<div class="flex items-center gap-2">
								<button
									class={twMerge(
										buttonVariants({
											variant: "filled",
											className: "flex items-center mt-4",
										}),
										(mutation.isSuccess ||
											mutation.isError) &&
											buttonVariants({ variant: "outline" }),
									)}
									disabled={mutation.isLoading}
								>
									{mutation.isLoading && (
										<span class="mr-1">
											<Loader />
										</span>
									)}
									{mutation.isError && "Retry?"}
									{mutation.isSuccess && "Add another"}
									{!mutation.isError && !mutation.isSuccess && "Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
