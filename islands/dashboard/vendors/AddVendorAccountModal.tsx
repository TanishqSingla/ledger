import Input from "../../../components/Input.tsx";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "../../../components/Button.tsx";
import {
	CrossIcon,
	Loader,
	PlusIcon,
} from "../../../components/icons/index.tsx";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { Vendor } from "../../../db/Vendors.ts";
import { useMutation } from "../../../hooks/useMutation.ts";
import { addVendorAccount } from "../../../services/vendor.ts";

export default function AddVendorAccountModal(
	{ vendorId }: { vendorId: string },
) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const mutation = useMutation({
		mutationFn: addVendorAccount,
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

		const body: Vendor["accounts"][0] = {
			...(formData.get("bank_name") &&
				{ bank_name: formData.get("bank_name")!.toString() }),
			account_number: formData.get("account_number")!.toString(),
			ifsc: formData.get("account_number")!.toString(),
		};

		mutation.mutate({ vendor_id: vendorId, account: body });
	};

	const handleClose = () => dialogRef.current?.close();

	return (
		<>
			<button
				class={buttonVariants({ variant: "filled" })}
				onClick={() => dialogRef.current?.showModal()}
			>
				<PlusIcon /> Add Account
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
								<label htmlFor="account_number" class="text-label-large">
									Account Number
									<Input
										placeholder="Account Number"
										name="account_number"
										id="account_number"
										required
									/>
								</label>

								<label htmlFor="ifsc" class="text-label-large">
									IFSC
									<Input placeholder="IFSC" id="ifsc" name="ifsc" />
								</label>

								<label htmlFor="bank_name" class="text-label-large">
									Bank Name
									<Input
										placeholder="Bank Name"
										id="bank_name"
										name="bank_name"
									/>
								</label>
							</div>

							<div class="flex items-center justify-end gap-2">
								<button
									className={buttonVariants({ variant: "text" })}
									type="button"
									onClick={handleClose}
								>
									Cancel
								</button>

								<button
									class={twMerge(
										buttonVariants({ variant: "filled" }),
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
									{!mutation.isError && !mutation.isSuccess &&
										"Create"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}
