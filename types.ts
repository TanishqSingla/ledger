export type MongoDocument = {
	created_at: Date;
	updated_at: Date;
};

type BillHistoryTypes =
	| {
		action: "CREATE" | "ARCHIVE" | "RESTORE";
	}
	| {
		action: "UPDATE";
		type: "ADD_PAYMENT" | "REMOVE_PAYMENT" | "REMOVE_INVOICE";
	};

type History = BillHistoryTypes & { user: string; timestamp: number };

export type Bill = {
	bill_id: string;
	amount?: number | string;
	vendor_id: string;
	vendor_name: string;
	status: "PENDING" | "IN_PAYMENT" | "PAID";
	history: History[];
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
	reference_number: string;
	bill_to: string;
	paid_from: Company;
	payment_time: Date;
};
export type PaymentDocument = Payment & MongoDocument;
