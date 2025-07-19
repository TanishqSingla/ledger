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
import { company, payments, vendors } from "@repositories/repos.ts";
import { VendorDocument } from "@/types.ts";
import { VendorSelect } from "@islands/dashboard/payments/VendorSelect.tsx";
import { uploadFile } from "@queries/s3.ts";

type Data = { vendors: VendorDocument[]; error?: string };

export const handler: Handlers = {
	GET: async (_req, ctx) => {
		const vendorsData = await vendors.GetAll();

		return ctx.render({ vendors: vendorsData } satisfies Data);
	},
	POST: async (req, ctx) => {
		const [vendorsData, companiesData] = await Promise.all([vendors.GetAll(), company.GetAll()]);

		const data = await req.formData();

		const files = data.getAll("files[]") as File[];
		const reference_number = data.get("reference_number");
		const account_id = data.get("account_id")!;
		const vendor = vendorsData.find(vendor => vendor.vendor_id == data.get("vendor_id")!);

		const fileQueries = await Promise.all(
			files.map((file) => uploadFile(file.name, file)),
		);

		const paymentQuery = payments.InsertOne({
			files: files.map((file) => file.name),
			...(reference_number && { reference_number }),
			paid_to: { vendor, ...(account_id && {account_id}) },
			created_at: new Date(Date.now()),
			updated_at: new Date(Date.now()),
		});

		try {
		} catch (err) {
			return ctx.render({ error: err });
		}

		return ctx.render({ vendors: [] });
	},
};

export default function CreatePayment({ data }: PageProps<Data>) {
	return (
		<div className="p-4">
			<h1 className="text-headline-medium my-4">Payments</h1>

			{data?.error && <p className="text-error">{data.error}</p>}

			<form
				className="space-y-4 mx-auto max-w-screen-lg border rounded-xl border-outline p-4"
				enctype="multipart/form-data"
				method="POST"
			>
				<Input name="reference_number" placeholder="Reference number" />

				<VendorSelect vendors={data.vendors} />

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
