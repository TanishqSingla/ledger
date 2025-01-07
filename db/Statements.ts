import { QueryCommand } from "https://esm.sh/@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/db.ts";

const TableName = "Statement";

export type Statement = {
	Id: string;
	FromAccount: string;
	Payee: string;
	Amount: string;
	Invoice: string;
};

export const GetStatements = async ({ limit = 10 }) => {
	try {
		const command = new QueryCommand({ TableName, Limit: limit });
		const response = await docClient.send(command);

		return response.Items as Statement[];
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const CreateStatement = async (statement: Statement) => {
};
