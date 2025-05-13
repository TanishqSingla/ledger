import { useState } from "preact/hooks";
import Input from "@components/Input.tsx";
import { FileUpload } from "./file-input.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { uploadBillPayment } from "@queries/bill.ts";
import { CrossIcon } from "@components/icons/index.tsx";

export default function AddBillPayment({ billId }: { billId: string }) {
	const [files, setFiles] = useState<File[]>([]);
	const [editMode, setEditMode] = useState(false);
	const [uploadFileError, setUploadFileError] = useState("");

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);

		const reference_number = formData.get("reference_number");

		if (files.length == 0 && !reference_number) {
			return;
		}

		const body = {
			...(formData.get("reference_number") &&
				{ reference_number: formData.get("reference_number") }),
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
			const uploadedFile = await uploadBillPayment(billId, files[0]);

			Object.assign(body, { file: uploadedFile.payment });
		}

		// Push payment to bill
		try {
			fetch(`/api/bill/${billId}/payments`, {
				method: "POST",
				body: JSON.stringify(body),
			});
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
					className={"max-w-screen-sm border p-4 rounded-xl border-primary space-y-4"}
				>
					<Input name={"reference_number"} placeholder={"Reference number"} />
					<FileUpload
						handleUpload={handleUpload}
						label="Attach payment"
						multiple={false}
					/>
					<div className={"flex flex-wrap gap-4"}>
						{files && files.map((file, index) => {
							return (
								<div
									className={"inline-flex items-center border border-outlineVariant h-8 rounded-lg px-2"}
								>
									<span>{file.name}</span>
									<button
										type={"button"}
										className={"ml-2"}
										onClick={() => removeFile(index)}
										aria-label="remove file"
									>
										<CrossIcon height={14} width={14} />
									</button>
								</div>
							);
						})}
					</div>

					{uploadFileError && <p className="text-error">{uploadFileError}</p>}

					<div className="space-x-4">
						<button
							type="submit"
							className={buttonVariants({ variant: "filled" })}
						>
							Submit
						</button>
						<button
							type="button"
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => setEditMode(false)}
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</>
	);
}
