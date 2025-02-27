import { useEffect, useState } from "preact/hooks";
import Input from "../../../components/Input.tsx";
import { Button } from "ketu";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "../../../components/Button.tsx";
import { vendorsSignal } from "./VendorsTable.tsx";
import { CrossIcon, Loader } from "../../../components/icons/index.tsx";

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
			const data = await resp.json();

			if (resp.status == 201) {
				vendorsSignal.value = [...vendorsSignal.value, data.data];
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
							<h1 class="text-title-large">Create vendor</h1>
							<button onClick={() => setOpen(false)} aria-label={"Close"}>
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
											"bg-tertiary text-onTertiary px-4 py-2 rounded-xl my-4 flex items-center",
											isError &&
												"bg-transparent border border-error text-error",
										)}
										disabled={loading}
									>
										{loading && (
											<span class="mr-1">
												<Loader />
											</span>
										)}
										{isError && "Retry?"}
										{isSuccess && "Add another"}
										{!isError && !isSuccess && "Create"}
									</Button>

									<Button
										class={twMerge(buttonVariants({
											variant: "destructiveOutline",
											className: "px-4 py-2 rounded-xl ml-2 flex h-auto",
										}))}
										type="button"
										onClick={() => {
											setOpen(false);
											setIsError(false);
											setIsSuccess(false);
										}}
									>
										Close
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
