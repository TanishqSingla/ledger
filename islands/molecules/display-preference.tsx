import { computed, effect, signal } from "@preact/signals";
import { GridIcon, ListIcon } from "../../components/icons/index.tsx";

export const DISPLAY_TYPE = {
	LIST: "LIST",
	GRID: "GRID",
} as const;

export const displayTypeSignal = signal<string | null>();

export const displayTypeComputed = computed(() => {
	if (!displayTypeSignal.value) {
		if (localStorage)
			return localStorage.getItem('displayType') || DISPLAY_TYPE.GRID;

		return DISPLAY_TYPE.GRID;
	}

	return displayTypeSignal.value;
})

effect(() => {
	if (displayTypeComputed.value)
		localStorage.setItem('displayType', displayTypeComputed.value)
});

export default function DisplayPreference() {
	const handleClick = (event: any) => {
		displayTypeSignal.value = event.currentTarget.value;
	};

	return (
		<div
			className={"flex border border-outline rounded-3xl divide-x divide-outline overflow-hidden h-10"}
		>
			<button
				title="list"
				value={DISPLAY_TYPE.LIST}
				className={"px-4 py-2 text-onSurface hover:bg-onSurface data-[selected=true]:bg-secondaryContainer hover:bg-opacity-[0.08]"}
				aria-selected={false}
				data-selected={displayTypeComputed.value === DISPLAY_TYPE.LIST}
				onClick={handleClick}
			>
				<ListIcon />
			</button>
			<button
				title="grid"
				value={DISPLAY_TYPE.GRID}
				className={"py-2 px-4 text-onSurface hover:bg-onSurface data-[selected=true]:bg-secondaryContainer hover:bg-opacity-[0.08]"}
				aria-selected={false}
				data-selected={displayTypeComputed.value === DISPLAY_TYPE.GRID}
				onClick={handleClick}
			>
				<GridIcon />
			</button>
		</div>
	);
}
