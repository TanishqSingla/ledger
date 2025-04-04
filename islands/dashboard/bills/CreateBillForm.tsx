import { useState } from "preact/hooks";
import Input from "../../../components/Input.tsx";
import { Bill } from "../../../db/Bills.ts";
import { Loader } from "../../../components/icons/index.tsx";
import { selectedVendor, VendorComboBox } from "../../Combobox.tsx";
import { buttonVariants } from "../../../components/Button.tsx";

export default function CreateBillForm() {
	const [files, setFiles] = useState<FileList>();
	const [uploadFileError, setUploadFileError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		setLoading(true);

		const formData = new FormData(event.target as HTMLFormElement);

		if (!selectedVendor.value) {
			return;
		}

		const body = {
			vendor_id: selectedVendor.value.vendor_id,
			vendor_name: selectedVendor.value.vendor_name,
			amount: formData.get("amount")?.toString() || 0,
			status:
				(formData.get("status")?.toString() || "PENDING") as Bill["status"],
		};

		const file = formData.get("invoices") as File;
		if (file.size > 5_000_000) {
			return;
		}

		const invoices = [];
		if (files) {
			const fileFormData = new FormData();
			fileFormData.append("invoices", files[0], "test-file");
			const response = await fetch("/api/s3", {
				method: "PUT",
				body: fileFormData,
			});

			if (response.status > 400) {
				console.log("Failed to upload file");
				return;
			}

			const data = await response.json();

			if (data?.invoices) {
				invoices.push(...data.invoices);
			}
		}

		Object.assign(body, { invoices });
		try {
			const resp = await fetch("/api/bill", {
				method: "PUT",
				body: JSON.stringify(body),
			});

			const data = await resp.json();
			if (data.data) {
				globalThis.location.href = '/dashboard/bills/' + data.data.bill_id;
			}
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = (event: any) => {
		const target = event.currentTarget as HTMLInputElement;
		if (!target.files) return;

		const size = [...target.files].reduce((acc, file) => file.size + acc, 0);
		console.log(size);
		if (size > 5_000_000) {
			setUploadFileError("File size exceeds limit");
			return;
		}

		setFiles(target.files);
		setUploadFileError("");
	};

	return (
		<form
			class="my-4 text-onSecondaryContainer max-w-screen-sm space-y-4 border border-secondary p-4 rounded-xl"
			onSubmit={handleSubmit}
		>
			<label class="text-title-medium my-4 block" htmlFor="accountName">
				Vendor Name:
				<VendorComboBox />
			</label>

			<label class="text-title-medium block">
				Amount
				<Input
					class="text-body-medium"
					name="amount"
				/>
			</label>

			<label class="text-title-medium block">
				Status:
				<select
					class="px-4 py-2 block rounded-xl bg-surfaceBright w-full"
					name="status"
				>
					<option value={"PENDING"}>Pending</option>
					<option value={"IN_PAYMENT"}>In Payment</option>
					<option value={"PAID"}>Paid</option>
				</select>
			</label>

			<label class="text-title-medium block">
				<p>Attach invoice:</p>
				<input type="file" name="invoices" onChange={handleUpload} />
			</label>
			{uploadFileError && <p className={"text-error"}>{uploadFileError}</p>}

			<div>
				<button
					type="submit"
					disabled={loading}
					class={buttonVariants({ variant: 'filled'})}
				>
					{loading && (
						<span class="mr-1">
							<Loader />
						</span>
					)}
					Add bill
				</button>
			</div>
		</form>
	);
}
