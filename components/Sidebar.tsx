import { twMerge } from "tailwind-merge";

type SidebarItem = {
	slug: string;
	label: string;
	subItems?: SidebarItem[];
};

const SidebarConfig = [
	{
		slug: "/dashboard/bills",
		label: "Bills",
		subItems: [{
			slug: "/dashboard/bills/create",
			label: "Create Bill",
		}],
	},
	{
		slug: "/dashboard/vendors",
		label: "Vendors",
	},
	{
		slug: "/dashboard/companies",
		label: "Companies",
	},
	{
		slug: "/dashboard/archive-bills",
		label: "Archive Bills",
	},
];

function SidebarItem({ item, active }: { item: SidebarItem; active: string }) {
	return (
		<div class="space-y-2">
			<a
				class={twMerge(
					"px-4 py-2 text-onSurface hover:bg-surfaceContainerHighest transition rounded-3xl text-body-large cursor-pointer block",
					active === item.slug && "bg-secondaryContainer text-onSurface",
				)}
				href={item.slug}
			>
				{item.label}
			</a>
			<div class="ml-2">
				{item?.subItems &&
					item.subItems.map((subItem, index) => (
						<SidebarItem key={index} item={subItem} active={active} />
					))}
			</div>
		</div>
	);
}

export default function Sidebar({ active }: { active: string }) {
	return (
		<div class="w-[280px] h-full rounded-2xl bg-surfaceContainer p-3">
			{SidebarConfig.map((item) => (
				<SidebarItem key={item.slug} item={item} active={active} />
			))}
		</div>
	);
}
