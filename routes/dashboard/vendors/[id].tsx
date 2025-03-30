import { Handlers, PageProps } from "$fresh/server.ts";
import { GetVendorFromId, Vendor } from "../../../db/Vendors.ts";

type Data = {
	vendor: Vendor;
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const { id } = ctx.params;

		const vendor = await GetVendorFromId(id);

		return ctx.render({ vendor });
	},
};

export default function VendorPage({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-small">
				Vendor{" "}
				<span className={"text-title-medium text-primary"}>#{data.vendor.vendor_id}</span>
			</h1>

			<section className={""}>
				<p>Name: {data.vendor.vendor_name}</p>
				<p>Email: {data.vendor.email || "-"}</p>
				<p>Phone: {data.vendor.phone || "-"}</p>
			</section>
		</div>
	);
}
