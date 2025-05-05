import { LayoutConfig, PageProps } from "$fresh/server.ts";
import Sidebar from "../../components/Sidebar.tsx";
import ProfileDropdown from "../../islands/molecules/profile-dropdown.tsx";

export const config: LayoutConfig = {
	skipInheritedLayouts: true,
};

export default function Layout({ Component, url }: PageProps) {
	return (
		<div class={'h-screen flex flex-col'}>
			<header class="p-4 text-onBackground rounded-2xl flex justify-between">
				<a class="text-headline-large" href="/dashboard">Ledger</a>
				<div>
					<ProfileDropdown />
				</div>
			</header>
			<div class="flex h-[calc(100vh-72px)]">
				<Sidebar active={url.pathname} />
				<div class="h-full w-full bg-surfaceContainerLowest text-onSurface rounded-3xl overflow-y-auto">
					<Component />
				</div>
			</div>
		</div>
	);
}
