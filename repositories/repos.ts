import {
	Collection,
	Document,
	Filter,
	FindOneAndDeleteOptions,
	FindOptions,
	OptionalUnlessRequiredId,
} from "mongodb";
import { Conn } from "@db/conn.ts";
import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
import type {
	Bill,
	BillDocument,
	CompanyDocument,
	PaymentDocument,
	User,
	Vendor,
	VendorDocument,
} from "@/types.ts";

export class BaseRepository<T extends Document> {
	model: Collection<T>;

	constructor(model: Collection<T>) {
		this.model = model;
	}

	async GetAll() {
		const resp = await this.model.find().toArray();

		return resp;
	}

	async Find(filter: Filter<T> = {}, options: FindOptions = {}) {
		const resp = await this.model.find(filter, options).toArray();

		return resp;
	}

	async DeleteOne(
		filter: Filter<T> = {},
		options: FindOneAndDeleteOptions = {},
	) {
		const resp = await this.model.findOneAndDelete(filter, options);

		return resp;
	}

	async InsertOne(payload: OptionalUnlessRequiredId<T>) {
		const resp = await this.model.insertOne(payload);

		return resp;
	}
}

export class BillsRepository extends BaseRepository<BillDocument> {
	constructor() {
		super(Conn.Bills);
	}

	static NewBill(values: Omit<Bill, "bill_id">, user: string) {
		return {
			...values,
			bill_id: nanoid(12),
			created_at: new Date(Date.now()),
			updated_at: new Date(Date.now()),
			history: [{ action: "CREATE", user, timestamp: Date.now() }],
		} satisfies BillDocument;
	}

	async GetById(bill_id: string) {
		return await this.model.findOne({ bill_id });
	}

	async GetDocumentsCount() {
		return await this.model.estimatedDocumentCount();
	}

	async SearchBill(query: string) {
		const resp = await this.model.find({
			$or: [{ vendor_name: { $regex: query, $options: "i" } }],
		}).toArray();

		return resp as BillDocument[];
	}
}
export const bills = new BillsRepository();

export class CompanyRepository extends BaseRepository<CompanyDocument> {
	constructor() {
		super(Conn.Companies);
	}

	static NewAccount(
		{ company_name, company_accounts }: {
			company_name: string;
			company_accounts: CompanyDocument["company_accounts"];
		},
	) {
		return {
			company_id: nanoid(12),
			company_name,
			company_accounts,
			created_at: new Date(Date.now()),
			updated_at: new Date(Date.now()),
		};
	}

	async GetById(company_id: string) {
		const resp = await this.model.findOne({ company_id });

		return resp;
	}
}
export const company = new CompanyRepository();

export class PaymentRepository extends BaseRepository<PaymentDocument> {
	constructor() {
		super(Conn.Payments);
	}
}
export const payments = new PaymentRepository();

export class VendorRepository extends BaseRepository<VendorDocument> {
	constructor() {
		super(Conn.Vendors);
	}

	static NewVendorDoc(
		{ vendor_name, email, phone, accounts }: {
			vendor_name: VendorDocument["vendor_name"];
			email?: VendorDocument["email"];
			phone?: VendorDocument["phone"];
			accounts: VendorDocument["accounts"];
		},
	) {
		return {
			vendor_id: nanoid(12),
			vendor_name,
			email,
			phone,
			accounts,
			created_at: new Date(Date.now()),
			updated_at: new Date(Date.now()),
		};
	}

	async GetById(id: string) {
		const resp = await this.model.findOne({ vendor_id: id }, {
			projection: { accounts: 1 },
		});

		return resp;
	}

	async GetAccounts(vendor_id: string) {
		const resp = await this.model.findOne({ vendor_id }, {
			projection: { accounts: 1 },
		});

		return resp;
	}

	async AddAccount(
		vendor_id: string,
		accounts: Required<Vendor>["accounts"][0],
	) {
		const resp = await this.model.updateOne({ vendor_id }, {
			//@ts-ignore: mongo
			"$push": { accounts },
		});

		return resp;
	}

	async DeleteAccount(
		vendor_id: string,
		accountId: string,
	) {
		const resp = await this.model.updateOne({ vendor_id }, {
			//@ts-ignore mongo
			"$pull": { accounts: { id: accountId } },
		});

		return resp;
	}
}
export const vendors = new VendorRepository();

class UserRepository extends BaseRepository<User> {
	constructor() {
		super(Conn.Users)
	}

	async GetUser(email_id: string) {
		return await this.model.findOne({ email_id })
	}
}
export const users = new UserRepository();

