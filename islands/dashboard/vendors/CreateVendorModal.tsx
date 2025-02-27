import { useEffect, useState } from "preact/hooks";
import Input from "../../../components/Input.tsx";
import { Button } from "ketu";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "../../../components/Button.tsx";
import { vendorsSignal } from "./VendorsTable.tsx";

export default function CreateVendorModal() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.body.style.overflow = "auto";
		};
	}, [open]);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target as HTMLFormElement);

		const body = {
			vendor_name: formData.get("vendor_name") as string,
			...(!!formData.get("email") && { email: formData.get("email") }),
			...(!!formData.get("phone") && { phone: formData.get("phone") }),
		};
		try {
			const resp = await fetch("/api/vendor", {
				method: "PUT",
				body: JSON.stringify(body),
			});

			if (resp.status == 201) {
				vendorsSignal.value = [...vendorsSignal.value, body];
				console.log(vendorsSignal);
				setIsSuccess(true);
				setIsError(false);
			}
		} catch (err) {
			console.log(err);
			setIsSuccess(false);
			setIsError(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				class="bg-tertiary text-onTertiary px-4 py-2 rounded-xl"
				onClick={() => setOpen(true)}
			>
				Create
			</button>
			{open && (
				<div class="fixed top-0 left-0 h-screen w-screen bg-black/40 z-10 items-center justify-center flex">
					<div class="z-20 bg-white max-w-screen-sm w-full rounded-xl">
						<div class="flex justify-between p-4">
							<h1>Create vendor</h1>
							<button onClick={() => setOpen(false)} aria-label={"Close"}>
								<svg
									title={"Close"}
									width="15"
									height="15"
									viewBox="0 0 15 15"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
										fill="currentColor"
										fill-rule="evenodd"
										clip-rule="evenodd"
									>
									</path>
								</svg>
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

								<Button
									class={twMerge(
										"bg-tertiary text-onTertiary px-4 py-2 rounded-xl my-4",
										isSuccess &&
											"bg-transparent border border-tertiary text-tertiary",
										isError && "bg-transparent border border-error text-error",
									)}
									disabled={loading}
								>
									{loading && "loading..."}
									{isError && "Retry?"}
									{isSuccess && "Add another"}
									{!loading && !isError && !isSuccess && "Create"}
								</Button>

								<Button
									class={twMerge(buttonVariants({
										variant: "destructive",
										className: "px-4 py-2 rounded-xl h-auto ml-2",
									}))}
									type="button"
									onClick={() => setOpen(false)}
								>
									Close
								</Button>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
