import Input from "@components/Input.tsx";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "@components/Button.tsx";
import { CrossIcon, Loader, PlusIcon } from "@components/icons/index.tsx";
import { useRef, useState } from "preact/hooks";
import { Vendor, VendorDocument } from "@db/Vendors.ts";
import { useVendorAccounts } from "@hooks/vendor/useVendorAccounts.tsx";
import { BankInfo, getBankInfo } from "@queries/vendor.ts";
import { effect, signal } from "@preact/signals";

const ifscInputSignal = signal("");
const bankInfoSignal = signal<BankInfo | null>(null);

effect(() => {
	if (!/\w{4}0[a-zA-Z0-9]{6}/.test(ifscInputSignal.value)) {
		bankInfoSignal.value = null;
		return;
	}

	(async () => {
		const resp = await getBankInfo(ifscInputSignal.value);

		if (resp == "Not Found") {
			bankInfoSignal.value = null;
			return;
		}

		bankInfoSignal.value = resp;
	})();
});

export default function AddVendorAccountModal(
	{ vendor }: { vendor: VendorDocument },
) {
	const { data: accountsData, createMutation } = useVendorAccounts(
		vendor.accounts || null,
	);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [error, setError] = useState(false);

	const validateFormBody = (body: Vendor["accounts"][0]) => {
		if (!/\w{4}0[a-zA-Z0-9]{6}/.test(body.ifsc)) {
			return null;
		}

		return body;
	};

	const handleSubmit = (e: SubmitEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		const account_number = formData.get("account_number")!.toString().trim();
		const ifsc = formData.get("ifsc")!.toString().trim();
		const id = account_number.toLowerCase() + ifsc.toLowerCase();

		if (accountsData.value.findIndex((account) => account.id === id) != -1) {
			return;
		}

		const body: Vendor["accounts"][0] = {
			...(formData.get("bank_name") &&
				{ bank_name: formData.get("bank_name")!.toString().trim() }),
			...(formData.get("branch_name") &&
				{ branch_name: formData.get("branch_name")!.toString().trim() }),
			account_number,
			ifsc,
			id,
		};

		const payload = validateFormBody(body);
		if (!payload) {
			setError(true);
			return;
		}
		setError(false);

		createMutation.mutate({ vendor_id: vendor.vendor_id, account: body });
	};

	const handleClose = () => dialogRef.current?.close();

	return (
		<>
			<button
				type="button"
				class={buttonVariants({ variant: "filled" })}
				onClick={() => dialogRef.current?.showModal()}
			>
				<PlusIcon /> Add Account
			</button>
			<dialog is="modal-dialog" ref={dialogRef} className="rounded-xl">
				<div class="z-20 bg-white max-w-screen-sm">
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
					<div class="px-4 my-4">
						<form
							onSubmit={handleSubmit}
						>
							<div className="my-4">
								<label htmlFor="account_number" class="text-label-large">
									Account number
									<Input
										placeholder="Account Number"
										name="account_number"
										id="account_number"
										required
									/>
								</label>

								<label htmlFor="ifsc" class="text-label-large">
									IFSC
									<Input
										placeholder="IFSC"
										id="ifsc"
										name="ifsc"
										value={ifscInputSignal.value}
										onInput={(e) =>
											ifscInputSignal.value = e.currentTarget.value}
									/>
								</label>
								{error && <p className="text-error">Invalid IFSC</p>}

								<label htmlFor="bank_name" class="text-label-large">
									Bank name
									<Input
										placeholder="Bank name"
										className={`read-only:bg-surfaceVariant read-only:border-gray-50 read-only:text-gray-400`}
										id="bank_name"
										name="bank_name"
										readonly={!!bankInfoSignal.value}
										value={bankInfoSignal.value?.BANK}
									/>
								</label>

								<label htmlFor="branch_name" class="text-label-large">
									Branch name
									<Input
										placeholder="Branch name"
										className={`read-only:bg-surfaceVariant read-only:border-gray-50 read-only:text-gray-400`}
										id="branch_name"
										name="branch_name"
										readonly={!!bankInfoSignal.value}
										value={bankInfoSignal.value?.BRANCH}
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
									type="submit"
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
									{!createMutation.isError && !createMutation.isSuccess &&
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
