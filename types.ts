export type MongoDocument = {
	created_at: Date;
	updated_at: Date;
};

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
		company_number: string;
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
