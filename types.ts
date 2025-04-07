import { ObjectId } from "mongodb";

export type MongoDocument = {
	_id: ObjectId;
	created_at: string;
	updated_at: string;
};
