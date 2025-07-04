import { type Config } from "tailwindcss";

export default {
	content: ["{routes,islands,components}/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#006A65",
				surfaceTint: "#006A65",
				onPrimary: "#FFFFFF",
				primaryContainer: "#9DF1EB",
				onPrimaryContainer: "#00201E",
				secondary: "#4A6361",
				onSecondary: "#FFFFFF",
				secondaryContainer: "#CCE8E5",
				onSecondaryContainer: "#051F1E",
				tertiary: "#48607B",
				onTertiary: "#FFFFFF",
				tertiaryContainer: "#D0E4FF",
				onTertiaryContainer: "#001D34",
				error: "#BA1A1A",
				onError: "#FFFFFF",
				errorContainer: "#FFDAD6",
				onErrorContainer: "#410002",
				background: "#F4FBF9",
				onBackground: "#161D1C",
				surface: "#F4FBF9",
				onSurface: "#161D1C",
				surfaceVariant: "#DAE5E3",
				onSurfaceVariant: "#3F4947",
				outline: "#6F7978",
				outlineVariant: "#BEC9C7",
				shadow: "#000000",
				scrim: "#000000",
				inverseSurface: "#2B3231",
				inverseOnSurface: "#ECF2F0",
				inversePrimary: "#81D5CE",
				primaryFixed: "#9DF1EB",
				onPrimaryFixed: "#00201E",
				primaryFixedDim: "#81D5CE",
				onPrimaryFixedVariant: "#00504C",
				secondaryFixed: "#CCE8E5",
				onSecondaryFixed: "#051F1E",
				secondaryFixedDim: "#B0CCC9",
				onSecondaryFixedVariant: "#324B49",
				tertiaryFixed: "#D0E4FF",
				onTertiaryFixed: "#001D34",
				tertiaryFixedDim: "#B0C9E7",
				onTertiaryFixedVariant: "#304962",
				surfaceDim: "#D5DBDA",
				surfaceBright: "#F4FBF9",
				surfaceContainerLowest: "#FFFFFF",
				surfaceContainerLow: "#EFF5F3",
				surfaceContainer: "#E9EFED",
				surfaceContainerHigh: "#E3E9E8",
				surfaceContainerHighest: "#DDE4E2",
			},
			fontSize: {
				"display-large": ["57px", {
					lineHeight: "64px",
					letterSpacing: "0.25px",
				}],
				"display-medium": ["45px", "52px"],
				"display-small": ["36px", "44px"],
				"headline-large": ["32px", "40px"],
				"headline-medium": ["28px", "36px"],
				"headline-small": ["24px", "32px"],
				"title-large": ["22px", "28px"],
				"title-medium": ["16px", {
					lineHeight: "24px",
					letterSpacing: "0.15px",
					fontWeight: 500,
				}],
				"title-small": ["14px", {
					lineHeight: "20px",
					letterSpacing: "0.1px",
					fontWeight: 500,
				}],
				"label-large": ["14px", { lineHeight: "20px", letterSpacing: "0.1px" }],
				"label-medium": ["12px", {
					lineHeight: "16px",
					letterSpacing: "0.5px",
				}],
				"label-small": ["11px", { lineHeight: "16px", letterSpacing: "0.5px" }],
				"body-large": ["16px", { lineHeight: "24px", letterSpacing: "0.5px" }],
				"body-medium": ["14px", {
					letterSpacing: "0.25px",
					lineHeight: "20px",
				}],
				"body-small": ["12px", { letterSpacing: "0.4px", lineHeight: "16px" }],
			},
		},
	},
} satisfies Config;
