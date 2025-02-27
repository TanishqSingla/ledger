import { signal } from "@preact/signals";
import { VendorDocument } from "../../../db/Vendors.ts";
import { vendorSearch } from "./VendorSearchbox.tsx";
import { useState } from "preact/hooks";
import { Button } from "ketu";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "../../../components/Button.tsx";

export const vendorsSignal = signal<VendorDocument[]>([]);

function VendorsTable() {
	const [loading, setLoading] = useState(false);

	const handleDelete = async (vendor: VendorDocument) => {
		try {
			setLoading(true);

			const resp = await fetch("/api/vendor", {
				method: "DELETE",
				body: JSON.stringify({ vendor_id: vendor.vendor_id }),
			});

			vendorsSignal.value = vendorsSignal.value?.filter((_vendor) =>
				_vendor.vendor_id != vendor.vendor_id
			);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<table class="table-auto w-full border-collapse">
			<thead>
				<tr>
					<th class="px-4 py-2 bg-surfaceContainer text-left">
						Vendor Name
					</th>
					<th class="px-4 py-2 bg-surfaceContainer text-left">Email</th>
					<th class="px-4 py-2 bg-surfaceContainer text-left">Phone</th>
					<th class="px-4 py-2 bg-surfaceContainer text-left">
						Created At
					</th>
					<th class="px-4 py-2 bg-surfaceContainer text-left">Actions</th>
				</tr>
			</thead>
			<tbody>
				{vendorsSignal.value.flatMap((vendor) =>
					vendor.vendor_name.toLowerCase().startsWith(vendorSearch.value)
						? (
							<tr key={vendor.vendor_id} class="border-b last:border-none">
								<td class="py-2 px-4">
									<a
										href={`/dashboard/vendors/${vendor.vendor_id}`}
										class="hover:underline"
									>
										{vendor.vendor_name}
									</a>
								</td>
								<td class="py-2 px-4">{vendor?.email}</td>
								<td class="py-2 px-4">{vendor?.phone}</td>
								<td class="py-2 px-4">
									{new Date(vendor.created_at).toLocaleString()}
								</td>
								<td class="py-2 px-4 flex gap-4 items-center">
									<a
										href={`/dashboard/vendors/${vendor.vendor_id}`}
										class="hover:underline text-blue-500"
										target={"_blank"}
										title={"Open in new window"}
									>
										<svg
											width="15"
											height="15"
											viewBox="0 0 15 15"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M12 13C12.5523 13 13 12.5523 13 12V3C13 2.44771 12.5523 2 12 2H3C2.44771 2 2 2.44771 2 3V6.5C2 6.77614 2.22386 7 2.5 7C2.77614 7 3 6.77614 3 6.5V3H12V12H8.5C8.22386 12 8 12.2239 8 12.5C8 12.7761 8.22386 13 8.5 13H12ZM9 6.5C9 6.5001 9 6.50021 9 6.50031V6.50035V9.5C9 9.77614 8.77614 10 8.5 10C8.22386 10 8 9.77614 8 9.5V7.70711L2.85355 12.8536C2.65829 13.0488 2.34171 13.0488 2.14645 12.8536C1.95118 12.6583 1.95118 12.3417 2.14645 12.1464L7.29289 7H5.5C5.22386 7 5 6.77614 5 6.5C5 6.22386 5.22386 6 5.5 6H8.5C8.56779 6 8.63244 6.01349 8.69139 6.03794C8.74949 6.06198 8.80398 6.09744 8.85143 6.14433C8.94251 6.23434 8.9992 6.35909 8.99999 6.49708L8.99999 6.49738"
												fill="currentColor"
											>
											</path>
										</svg>
									</a>
									<Button
										class={twMerge(
											buttonVariants({
												variant: "link",
												class: "hover:underline p-2 text-error",
											}),
										)}
										title="Remove vendor"
										aria-label="Remove vendor"
										onClick={() => handleDelete(vendor)}
										disabled={loading}
									>
										<svg
											width="15"
											height="15"
											viewBox="0 0 15 15"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
												fill="currentColor"
												fill-rule="evenodd"
												clip-rule="evenodd"
											>
											</path>
										</svg>
									</Button>
								</td>
							</tr>
						)
						: []
				)}
			</tbody>
		</table>
	);
}

export default function WithSignal(
	{ vendors }: { vendors: VendorDocument[] },
) {
	vendorsSignal.value = vendors;
	return <VendorsTable />;
}
