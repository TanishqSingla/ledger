import { useEffect, useState } from "preact/hooks";
import Input from "../components/Input.tsx";
import { ComponentProps } from "preact/src/index.d.ts";
import { Vendor } from "../db/Vendors.ts";

type ComboBoxProps = {} & ComponentProps<"input">;

export default function ComboBox(props: ComboBoxProps) {
	const [value, setValue] = useState("");
	const [vendors, setVendors] = useState<Vendor[]>([]);
	const [loading, setLoading] = useState(false);
	const [valueSelected, setValueSelected] = useState(false);

	const handleCreate = () => {
		setLoading(true);
		fetch("/api/vendor", {
			method: "PUT",
			body: JSON.stringify({
				vendor_name: value,
				vendor_id: crypto.randomUUID(),
			}),
		}).then((resp) => resp.json())
			.then(() => {
				setValue(value);
				setValueSelected(true);
			}).finally(() => setLoading(false));
	};

	const handleInput = (event: any) => {
		if (valueSelected) setValueSelected(false);
		setValue(event.target.value);
	};

	const handleSelect = (vendor: Vendor) => {
		console.log(vendor);
		setValue(vendor.vendor_name);
		setValueSelected(true);
	};

	const showCreateOption = () => {
		const exactMatch = vendors.find((vendor) => vendor.vendor_name == value);

		if (exactMatch) {
			return false;
		}

		return true;
	};

	useEffect(() => {
		if (!value) return;

		const timeout = setTimeout(() => {
			setLoading(true);
			fetch("/api/vendor", {
				method: "POST",
				body: JSON.stringify({ value: value.trim() }),
			}).then((data) => data.json()).then((data) => setVendors(data.data))
				.finally(() => setLoading(false));
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	}, [value]);

	return (
		<div class="relative">
			<Input
				value={value}
				onInput={handleInput}
				name={props.name}
				autocomplete={"off"}
			/>
			{!!value && !valueSelected && (
				<div class="shadow-lg rounded-xl border border-secondary absolute top-full w-full bg-surfaceContainerHigh mt-1 overflow-hidden">
					{loading && <>loading...</>}
					{!loading && showCreateOption() && (
						<div
							class="bg-surfaceContainerLowest hover:bg-surfaceContainerLow py-2 px-4 cursor-pointer"
							onClick={handleCreate}
						>
							<span class="text-label-small bg-surfaceContainerHighest px-1 rounded-xl">
								Create vendor
							</span>{" "}
							{value}
						</div>
					)}
					{!loading && !valueSelected && vendors.map((vendor) => {
						return (
							<div
								class="bg-white hover:bg-surfaceContainerLow py-2 px-4 cursor-pointer"
								key={vendor.vendor_id}
								onClick={(event) => {
									handleSelect(vendor);
								}}
							>
								{vendor.vendor_name}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
