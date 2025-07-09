import { useEffect, useState } from "preact/hooks";
import Input from "@components/Input.tsx";
import { FileUpload } from "./file-input.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { uploadBillPayment } from "@queries/bill.ts";
import { CrossIcon, Loader } from "@components/icons/index.tsx";
import { BillDocument } from "@db/Bills.ts";
import { getVendorAccounts } from "@queries/vendor.ts";
import usePayment from "@hooks/bills/usePayment.ts";
import { VendorDocument } from "@/types.ts";

export default function AddBillPayment({ bill }: { bill: BillDocument }) {
	const [files, setFiles] = useState<File[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [uploadFileError, setUploadFileError] = useState("");
	const [vendorAccounts, setVendorAccounts] = useState<
		VendorDocument["accounts"]
	>();

	const { createPayment } = usePayment(bill.payments);

	useEffect(() => {
		getVendorAccounts(bill.vendor_id).then((data) => {
			if (data.accounts) {
				setVendorAccounts(data.accounts);
			}
		});

		function handlePasteEvent(event: ClipboardEvent) {
			if (event.clipboardData?.files) {
				setFiles((prev) => [...prev, ...[event.clipboardData!.files][0]]);
			}
		}

		document.addEventListener("paste", handlePasteEvent);

		return () => {
			document.removeEventListener("paste", handlePasteEvent);
		};
	}, []);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const reference_number = formData.get("reference_number");

		if (files.length == 0 && !reference_number) {
			return;
		}

		const body = {
			...(formData.get("reference_number") &&
				{ reference_number: formData.get("reference_number")!.toString() }),
			...(formData.get("vendor_account") &&
				{ vendor_account: formData.get("vendor_account")!.toString() }),
		};

		const fileSize = [...files].reduce((acc, file) => file.size + acc, 0);
		if (fileSize > 5_000_000) {
			setUploadFileError("File size exceeds limit");
			return;
		} else {
			setUploadFileError("");
		}

		// Upload files to s3
		if (files.length) {
			const uploadedFile = await uploadBillPayment(bill.bill_id, files[0]);

			Object.assign(body, { file: uploadedFile.payment });
		}

		// Push payment to bill
		try {
			await createPayment.mutate({ billId: bill.bill_id, payment: body });

			setEditMode(false);
			setUploadFileError("");
			setFiles([]);
		} catch (err) {
			console.log(err);
		}
	};

	const handleUpload = (inputFiles: File[]) => {
		if (inputFiles.length > 1 || files.length == 1) {
			setUploadFileError("Can't upload more than 1 file");
			return;
		}

		const size = [...inputFiles].reduce((acc, file) => file.size + acc, 0);
		if (size > 5_000_000) {
			setUploadFileError("File size exceeds limit");
			return;
		}

		setFiles((prev) => [...prev, ...inputFiles]);
		setUploadFileError("");
	};

	const removeFile = (index: number) => {
		setFiles(files.toSpliced(index, 1));
	};

	return (
		<>
			{!editMode && (
				<button
					type="button"
					className={buttonVariants({ variant: "filled" })}
					onClick={() => setEditMode(true)}
				>
					Add payment
				</button>
			)}

			{editMode && (
				<form
					onSubmit={handleSubmit}
					className="max-w-screen-sm border p-4 rounded-xl border-primary space-y-4"
				>
					<Input name="reference_number" placeholder="Reference number" />

					{vendorAccounts && vendorAccounts.length > 0 && (
						<>
							<label for="vendor_account">Vendor's Account:</label>
							<select
								name="vendor_account"
								className="border rounded-xl px-4 py-2 ml-4"
							>
								{vendorAccounts.map((account) => (
									<option key={account.id} value={account.id}>
										{account.account_number} ({account.bank_name})
									</option>
								))}
							</select>
						</>
					)}

					<FileUpload
						handleUpload={handleUpload}
						label="Attach payment"
						multiple={false}
						disabled={files.length > 0}
					/>

					<div className="flex flex-wrap gap-4">
						{files && files.map((file, index) => {
							return (
								<div className="flex flex-col border border-outlineVariant rounded-lg px-2">
									<div className="inline-flex justify-between">
										<span>{file.name}</span>
										<button
											type="button"
											className="ml-auto"
											onClick={() => removeFile(index)}
											aria-label="remove file"
										>
											<CrossIcon height={14} width={14} />
										</button>
									</div>
									{file.type.startsWith("image/") && (
										<figure className="w-60 inline-flex">
											<img
												src={URL.createObjectURL(file)}
												className="object-contain"
											/>
										</figure>
									)}

									{file.type === "application/pdf" && (
										<embed src={URL.createObjectURL(file)} width={240} />
									)}
								</div>
							);
						})}
					</div>

					{uploadFileError && <p className="text-error">{uploadFileError}</p>}

					<div className="space-x-4">
						<button
							type="submit"
							className={buttonVariants({ variant: "filled" })}
							disabled={createPayment.isLoading}
						>
							{createPayment.isLoading && <Loader />}
							Submit
						</button>
						<button
							type="button"
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => setEditMode(false)}
							disabled={createPayment.isLoading}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</>
	);
}
