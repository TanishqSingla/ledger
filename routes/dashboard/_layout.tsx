import { LayoutConfig, PageProps } from "$fresh/server.ts";
import Sidebar from "../../components/Sidebar.tsx";

export const config: LayoutConfig = {
	skipInheritedLayouts: true,
};

export default function Layout({ Component, url }: PageProps) {
	return (
		<>
			<header class="p-4 text-onBackground rounded-2xl ">
				<a class="text-headline-large" href="/dashboard">Ledger</a>
			</header>
			<div class="flex">
				<Sidebar active={url.pathname} />
				<div
					class="flex-grow bg-surfaceContainerLowest text-onSurface rounded-3xl"
				>
					<Component />
				</div>
			</div>
		</>
	);
}
