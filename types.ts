export type MongoDocument = {
	created_at: Date;
	updated_at: Date;
};

type ActionHistory = {
	user: string;
	timestamp: number;
};

type BillHistoryTypes =
	| {
		action: "CREATE" | "ARCHIVE" | "RESTORE";
	}
	| {
		action: "UPDATE";
		type: "ADD_PAYMENT" | "REMOVE_PAYMENT" | "REMOVE_INVOICE";
	};

type PaymentHistoryTypes = {
	action: "CREATE";
} | { action: "UPDATE"; type: "UPDATE_AMOUNT" };

type BillHistory = BillHistoryTypes & ActionHistory;
type PaymentHistory = ActionHistory & PaymentHistoryTypes;

export type Bill = {
	bill_id: string;
	amount?: number | string;
	vendor_id: string;
	vendor_name: string;
	status: "PENDING" | "IN_PAYMENT" | "PAID";
	history: BillHistory[];
	comments?: { comment: string; user: string }[];
	payments?: {
		reference_number?: string;
		vendor_account?: string;
		file?: string;
	}[];
	invoices?: string[];
};

export type BillDocument = Bill & MongoDocument;

export type Vendor = {
	vendor_id: string;
	vendor_name: string;
	email?: string;
	phone?: string;
	accounts: {
		id: string;
		bank_name?: string;
		branch_name?: string;
		account_number: string;
		ifsc: string;
	}[];
};

export type VendorDocument = Vendor & MongoDocument;

export type Company = {
	company_id: string;
	company_name: string;
	company_accounts: {
		id: string;
		bank_name?: string;
		branch_name?: string;
		account_number: string;
		ifsc: string;
	}[];
};

export type CompanyDocument = Company & MongoDocument;

export type BankInfo = {
	"MICR": string;
	"BRANCH": string;
	"ADDRESS": string;
	"STATE": string;
	"CONTACT": string;
	"UPI": boolean;
	"RTGS": boolean;
	"CITY": string;
	"CENTRE": string;
	"DISTRICT": string;
	"NEFT": boolean;
	"IMPS": boolean;
	"SWIFT": string;
	"ISO3166": string;
	"BANK": string;
	"BANKCODE": string;
	"IFSC": string;
};

export type Payment = {
	/** Reference number of payment by the bank */
	reference_number?: string;
	amount?: string;
	paid_to: string;
	paid_from: {
		company: Company;
		account_id: Company["company_accounts"][0]["id"];
	};
	files: { name: string; url: string }[];
	history: PaymentHistory[];
};
export type PaymentDocument = Payment & MongoDocument;

export type User = {
	email_id: string;
};
