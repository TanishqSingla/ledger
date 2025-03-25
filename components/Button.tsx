import { cva } from "class-variance-authority";

export const buttonVariants = cva(
	"rounded-[20px] text-label-large font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:text-onSurface disabled:text-opacity-[0.38] disabled:bg-onSurface disabled:bg-opacity-[0.12] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				filled: "bg-primary text-onPrimary",
				destructive: "bg-error text-onError shadow-sm hover:bg-error/90",
				destructiveOutline:
					"border border-error text-error shadow-sm hover:bg-error/90 hover:text-onError",
				outline: "border border-outline text-primary bg-transparent hover:bg-primary hover:bg-opacity-[0.08] active:bg-primary active:bg-opacity-[0.1]",
				secondary:
					"bg-secondary text-onSecondary shadow-sm hover:bg-secondary/80",
				ghost: "hover:bg-tertiary hover:onTertiary",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "px-6 h-10",
				sm: "h-8 rounded-full px-3 text-xs",
				lg: "h-10 rounded-full px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "filled",
			size: "default",
		},
	},
);
