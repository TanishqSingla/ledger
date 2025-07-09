import Input from "@components/Input.tsx";
import {
	FileUpload,
	FileUploadError,
	fileUploadErrorSignal,
	FileUploadPlaceholder,
	FileUploadPreview,
} from "@islands/organisms/FileUpload.tsx";
import { AddFilesIcon } from "@components/icons/index.tsx";
import { buttonVariants } from "@components/Button.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";

type Data = { error?: string };

export const handler: Handlers = {
	POST: async (req, ctx) => {
		const data = await req.formData();

		const files = data.getAll("files[]");

		const reference_number = data.get("reference_number");

		try {
		} catch (err) {
			return ctx.render({ error: err });
		}

		return ctx.render();
	},
};

export default function CreatePayment({ error }: PageProps<Data>) {
	return (
		<div className="p-4">
			<h1 className="text-headline-medium my-4">Payments</h1>

			{error && <p className="text-error">{error}</p>}

			<form
				className="space-y-4 mx-auto max-w-screen-lg border rounded-xl border-outline p-4"
				enctype="multipart/form-data"
				method="POST"
			>
				<Input name="reference_number" placeholder="Reference number" />

				<FileUpload
					name="files[]"
					multiple
					className={`h-40 rounded-xl w-full grid place-items-center  cursor-pointer border border-surfaceVariant border-dashed data-[active=true]:border-surfaceTint`}
				>
					<AddFilesIcon height="72" width="72" />
					<FileUploadPlaceholder>
						<p className="text-gray-400">Click or Drag Files to upload</p>
					</FileUploadPlaceholder>

					<FileUploadError>
						<p className="text-error">{fileUploadErrorSignal.value}</p>
					</FileUploadError>
				</FileUpload>

				<FileUploadPreview />

				<button type="submit" className={buttonVariants({ variant: "filled" })}>
					Create
				</button>
			</form>
		</div>
	);
}
