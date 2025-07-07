import { MongoDocument } from "../types.ts";
import { Account } from "./Accounts.ts";

type Payment = {
	reference_number: string;
	bill_to: string;
	paid_from: Account;
	payment_time: Date;
};

export type PaymentDocument = Payment & MongoDocument;
