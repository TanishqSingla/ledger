import { useRef, useState } from "preact/hooks";
import { AddFiles } from "@components/icons/index.tsx";

type FileUploadProps = {
	handleUpload: (files: File[]) => void;
	label: string;
	multiple: boolean;
	disabled?: boolean;
};

export const FileUpload = (
	{ handleUpload, label, multiple, disabled }: FileUploadProps,
) => {
	const [active, setActive] = useState(false);

	const dropAreaRef = useRef<HTMLLabelElement>(null);

	const highlight = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (active) return;
		setActive(true);
	};
	const unhighlight = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (!active) return;
		setActive(false);
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (active) setActive(false);

		const dataTransfer = event.dataTransfer;

		const files = dataTransfer?.files;
		if (files) {
			const allowedFiles = [...files].filter((file) =>
				file.type === "application/pdf" || file.type.includes("image/")
			);
			handleUpload(allowedFiles);
		}
	};

	const handleFileChange = (event: any) => {
		const target = event.currentTarget as HTMLInputElement;

		if (target.files) {
			handleUpload([...target.files]);
		}
	};

	return (
		<>
			<label
				className={`h-40 rounded-xl w-full grid place-items-center ${
					disabled ? "bg-gray-100" : "bg-surfaceBright"
				} cursor-pointer border border-surfaceVariant border-dashed data-[active=true]:border-surfaceTint`}
				for="invoices"
				ref={dropAreaRef}
				onDragEnter={highlight}
				onDragOver={highlight}
				onDragLeave={unhighlight}
				onDrop={handleDrop}
				data-active={active}
			>
				<AddFiles height="72" width="72" />
				<p>
					{label}
				</p>
			</label>
			<input
				type="file"
				multiple={multiple}
				id="invoices"
				name="invoices"
				class="hidden"
				onChange={handleFileChange}
				accept="image/*,.pdf"
				disabled={disabled}
			/>
		</>
	);
};
