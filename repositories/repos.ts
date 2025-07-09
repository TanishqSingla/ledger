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
import { Vendor, VendorDocument } from "@/types.ts";

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

		return { ...resp, data: payload };
	}
}

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
		const resp = await this.model.findOne({ id }, {
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
