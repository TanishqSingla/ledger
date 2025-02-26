import { ComponentProps } from "preact/src/index.d.ts";
import Input from "../../../components/Input.tsx";
import { signal } from "@preact/signals";

export const vendorSearch = signal("");

export default function VendorSearchBox({ ...props }: ComponentProps<"input">) {
	return (
		<div class="flex items-center">
			<Input
				type="search"
				onInput={(e) => vendorSearch.value = e.currentTarget.value}
				value={vendorSearch.value}
				placeholder={"search"}
				{...props}
			/>
			<button onClick={() => vendorSearch.value = ''}>Clear</button>
		</div>
	);
}
