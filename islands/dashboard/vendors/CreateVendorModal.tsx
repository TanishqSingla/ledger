import Input from "../../../components/Input.tsx";
import { Button } from "ketu";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "../../../components/Button.tsx";
import { vendorsSignal } from "./VendorsTable.tsx";
import { CrossIcon, Loader } from "../../../components/icons/index.tsx";
import { useMutation } from "../../../hooks/useMutation.ts";
import { putVendor } from "../../../services/vendor.ts";
import { signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";

const openSignal = signal(false);

export const CreateVendorDialogTrigger = () => {
	return (
		<button
			class="bg-tertiary text-onTertiary px-4 py-2 rounded-xl"
			onClick={() => openSignal.value = !openSignal.value}
		>
			Create
		</button>
	);
};

const handleKeyboardEvent = (event: KeyboardEvent) => {
	if (event.key === "Escape") {
		openSignal.value = false;
	}
};

export function CreateVendorDialogContent() {
	const modalContentRef = useRef<HTMLDivElement>(null);

	const mutation = useMutation({
		mutationFn: putVendor,
		onSuccess: (data) => {
			vendorsSignal.value = [...vendorsSignal.value, data.data];

			setTimeout(() => {
				mutation.reset();
			}, 3000);
		},
	});

	useEffect(() => {
		if (openSignal.value) {
			document.body.style.overflow = "hidden";
			globalThis.addEventListener("keydown", handleKeyboardEvent);
		}

		return () => {
			document.body.style.overflow = "auto";
			globalThis.removeEventListener("keydown", handleKeyboardEvent);
		};
	}, [openSignal.value]);

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

	const focusOutHandler = (event: FocusEvent) => {
		if (!(event.relatedTarget instanceof Node)) return;

		if (!modalContentRef.current?.contains(event.relatedTarget)) {
			modalContentRef.current?.focus();
		}
	}

	return openSignal.value && (
		<div class="fixed top-0 left-0 h-screen w-screen bg-black/40 z-10 items-center justify-center flex" onFocusOutCapture={focusOutHandler} tabindex={0} ref={modalContentRef} role="dialog">
			<div class="z-20 bg-white max-w-screen-sm w-full rounded-xl">
				<div class="flex justify-between p-4">
					<h1 class="text-title-large">Create vendor</h1>
					<button
						onClick={() => openSignal.value = false}
						aria-label={"Close"}
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
						</label>
						<Input
							placeholder="Vendor Name"
							name="vendor_name"
							id="vendor_name"
							required
						/>

						<label htmlFor="email" class="text-label-large">
							Vendor Email
							<Input placeholder="Email" id="email" name="email" />
						</label>

						<label htmlFor="phone" class="text-label-large">
							Vendor Phone
							<Input placeholder="Phone" id="phone" name="phone" />
						</label>

						<div class="flex items-center gap-2">
							<Button
								class={twMerge(
									buttonVariants({ variant: "default", class: "block mt-4" }),
									(mutation.isSuccess ||
										mutation.isError) &&
										buttonVariants({ variant: "secondary" }),
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
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
