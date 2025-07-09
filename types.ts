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


