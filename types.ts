type id = string;

export type Account = {
	pk: `ACC#${id}`;
	sk: `ACC#${id}`;
	AccountName: string;
	IsUserOwned: boolean;
	BankDetails: {
		AccountNumber?: string;
		IFSC?: string;
	};
};

export type Payment = {
	pk: `PM#${id}`;
	sk: string;
	AccountId: string;
	Amount: string;
	InvoiceDate: string;
	BeneficiaryId: string;
};

export type Record = {
	pk: `REC#${id}`;
	sk: `REC#${id}`;
	AccountId: string;
	Amount: string;
	BeneficiaryId: string;
	InvoiceDate: string;
	PaymentMethod: "CHQ" | "NEFT" | "RTGS" | "UPI";
	PaymentDate: string;
	Ref: string;
	TransactionType: "credit" | "debit";
};
