import { useEffect, useState } from "preact/hooks";
import Input from "@components/Input.tsx";
import { signal } from "@preact/signals";
import { useMutation } from "@hooks/useMutation.ts";
import { putVendor } from "@queries/vendor.ts";
import { Vendor } from "@db/conn.ts";

export const selectedVendor = signal<Vendor>();

export const VendorComboBox = () => {
	const [value, setValue] = useState("");
	const [vendors, setVendors] = useState<Vendor[]>([]);
	const [loading, setLoading] = useState(false);
	const [valueSelected, setValueSelected] = useState(false);

	const createMutation = useMutation({
		mutationFn: putVendor,
		onSuccess: (data) => {
			setValueSelected(true);
			selectedVendor.value = data.data;
		},
		onError: (err) => {
			console.log(err);
			setValueSelected(false);
		},
	});

	const handleCreate = () => {
		createMutation.mutate({ vendor_name: value });
	};

	const handleInput = (event: any) => {
		if (valueSelected) setValueSelected(false);
		setValue(event.currentTarget.value);
	};

	const handleSelect = (vendor: Vendor) => {
		selectedVendor.value = vendor;
		setValue(vendor.vendor_name);
		setValueSelected(true);
	};

	const showCreateOption = () => {
		const exactMatch = vendors.find((vendor) =>
			vendor.vendor_name == selectedVendor.value?.vendor_name
		);

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
				body: JSON.stringify({
					value,
				}),
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
				disabled={createMutation.isLoading}
				autocomplete="off"
				placeholder="Select Vendor"
				name="vendor"
			/>
			{!!value && !valueSelected && (
				<div class="shadow-lg rounded-xl border border-secondary absolute top-full w-full bg-surfaceContainerHigh mt-1 overflow-hidden">
					{loading && <>loading...</>}
					{(!loading || createMutation.isLoading) && showCreateOption() && (
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
};
