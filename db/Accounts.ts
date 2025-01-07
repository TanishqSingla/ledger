import { ScanCommand } from "https://esm.sh/@aws-sdk/lib-dynamodb";
import { docClient } from "../utils/db.ts";

type Account = {
	id: string;
	Name: string;
	Accounts: string[];
};

export const GetAccounts = async () => {
	try {
		const command = new ScanCommand({ TableName: "Accounts" });
		const response = await docClient.send(command);

		return response.Items as Account[];
	} catch (err) {
		console.log(err);
		return null;
	}
};
