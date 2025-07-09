import { Handlers, PageProps } from "$fresh/server.ts";
import VendorsData from "@islands/dashboard/vendors/vendors-data.tsx";
import VendorSearchBox from "@islands/dashboard/vendors/VendorSearchbox.tsx";
import DisplayPreference from "@islands/molecules/display-preference.tsx";
import { KV_KEYS } from "@utils/constants.ts";
import { kv } from "@utils/db.ts";
import { buttonVariants } from "@components/Button.tsx";
import { VendorDocument } from "@/types.ts";
import { vendors } from "@repositories/repos.ts";

type Data = {
	vendors: VendorDocument[];
};

export const handler: Handlers = {
	GET: async function (_req, ctx) {
		const cache = await kv.get<VendorDocument[]>([KV_KEYS.VENDORS]);

		if (!!cache.value && cache.value?.length > 0) {
			console.log("[Cache]: vendors hit");
			return ctx.render({ vendors: cache.value });
		}

		console.log("[Cache]: vendors miss");
		const data = await vendors.GetAll();
		kv.set([KV_KEYS.VENDORS], data);

		return ctx.render({ vendors: data });
	},
};
export default function Vendors({ data }: PageProps<Data>) {
	return (
		<div class="p-4">
			<h1 class="text-display-small">Vendors</h1>

			<section class="flex items-center my-8 gap-4">
				<div class="flex gap-4">
					<VendorSearchBox />
				</div>

				<div class="ml-auto flex gap-4">
					<DisplayPreference />

					<a
						href="/dashboard/vendors/create"
						className={buttonVariants({ variant: "filled" })}
					>
						Create
					</a>
				</div>
			</section>

			<VendorsData vendors={data.vendors} />
		</div>
	);
}
