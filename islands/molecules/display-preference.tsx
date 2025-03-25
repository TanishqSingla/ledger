import { GridIcon, ListIcon } from "../../components/icons/index.tsx";

export default function DisplayPreference() {
	return (
		<div
			className={"flex border border-outline rounded-3xl bg-surfaceContainerLow divide-x divide-outline overflow-hidden"}
		>
			<button
				title="list"
				className={"px-4 py-2 text-onSurface"}
				aria-selected={false}
			>
				<ListIcon />
			</button>
			<button
				title="grid"
				className={"py-2 px-4 text-onSurface"}
				aria-selected={false}
			>
				<GridIcon />
			</button>
		</div>
	);
}
