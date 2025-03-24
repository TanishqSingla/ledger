export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const SENDER_EMAIL = `mails.tanishqsingla.in`;

export const KV_KEYS = {
	USERS: "users",
	ACCOUNTS: "accounts",
};

export const billStatusBadgeMap = {
	"PENDING": { variant: "warning", text: "Pending" },
	"IN_PAYMENT": { variant: "neutral", text: "In Payment" },
	"PAID": { variant: "success", text: "Paid" },
} as const;
