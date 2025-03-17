import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-body-medium font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-onPrimary shadow hover:bg-primary/90",
				destructive: "bg-error text-onError shadow-sm hover:bg-error/90",
				destructiveOutline:
					"border border-error text-error shadow-sm hover:bg-error/90 hover:text-onError",
				outline:
					"border border-primary bg-background shadow-sm hover:bg-primary hover:text-onPrimary",
				secondary:
					"bg-secondary text-onSecondary shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-tertiary hover:onTertiary",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-full px-3 text-xs",
				lg: "h-10 rounded-full px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);
