import { signal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { JSX } from "preact/src/index.d.ts";
import { twMerge } from "tailwind-merge";
import { CrossIcon } from "@components/icons/index.tsx";
type FileUploadProps = JSX.InputHTMLAttributes<HTMLInputElement>;

export const fileUploadSignal = signal<File[]>([]);
export const fileUploadErrorSignal = signal("");

export function FileUpload(props: FileUploadProps) {
	const [active, setActive] = useState(false);

	useEffect(() => {
		function handlePasteEvent(event: ClipboardEvent) {
			if (event.clipboardData?.files) {
				fileUploadSignal.value = [
					...fileUploadSignal.value,
					...[event.clipboardData!.files][0],
				];
			}
		}
		document.addEventListener("paste", handlePasteEvent);

		return () => {
			document.removeEventListener("paste", handlePasteEvent);
		};
	}, []);

	const handleFileChange: JSX.InputEventHandler<HTMLInputElement> = (event) => {
		const { currentTarget } = event;

		if (!currentTarget.files) {
			return;
		}

		if (currentTarget.multiple) {
			fileUploadSignal.value = [
				...fileUploadSignal.value,
				...currentTarget.files,
			];

			return;
		}

		fileUploadSignal.value = [...currentTarget.files];
	};

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

		setActive(false);

		const files = event.dataTransfer?.files;
		if (files) {
			const allowedFiles = [...files].filter((file) =>
				file.type === "application/pdf" || file.type.includes("image/")
			);

			fileUploadSignal.value = allowedFiles;
		}
	};

	return (
		<label
			className={props.className}
			onDragEnter={highlight}
			onDragOver={highlight}
			onDragLeave={unhighlight}
			onDrop={handleDrop}
			data-active={active}
			aria-disabled={props.disabled}
		>
			<input
				{...props}
				type="file"
				onChange={handleFileChange}
				className="hidden"
			/>
			{props.children}
		</label>
	);
}

export function FileUploadPlaceholder(
	{ children }: { children?: JSX.Element },
) {
	return fileUploadSignal.peek().length == 0 ? <div>{children}</div> : null;
}

export function FileUploadError({ children }: { children?: JSX.Element }) {
	return fileUploadErrorSignal.peek() !== "" ? <div>{children}</div> : null;
}

export function FileUploadPreview({ className }: { className?: string }) {
	const removeFile = (index: number) => {
		fileUploadSignal.value = fileUploadSignal.value.toSpliced(index, 1);
	};

	return (
		<div className={twMerge("flex flex-wrap gap-4", className)}>
			{fileUploadSignal.value && fileUploadSignal.value.map((file, index) => {
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
	);
}
