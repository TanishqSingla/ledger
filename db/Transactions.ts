import { PutCommand, PutCommandOutput, ScanCommand } from "https://esm.sh/@aws-sdk/lib-dynamodb";
import { docClient, kv } from "../utils/db.ts";
import { Account } from "../types.ts";
import { KV_KEYS } from "../utils/constants.ts";

export async function GetAllAccounts() {
	// Check for cache
	const businesses = await kv.get<Account[]>(["Accounts"]);

	// Return on cache hit
	if (businesses.value && businesses.value.length) {
		console.log(businesses);
		return businesses.value;
	}

	// Fetch and return on cache miss
	const query = new ScanCommand({
		TableName: "Transactions",
		FilterExpression: "begins_with (pk, :val)",
		ExpressionAttributeValues: {
			":val": "ACC",
		},
	});

	const response = await docClient.send(query);

	if (!response.Items) {
		return null;
	}

	// Fill cache
	kv.set([KV_KEYS.ACCOUNTS], response.Items, { expireIn: 1000 * 3600 });

	return response.Items as Account[];
}

export type AddAccountBody = {
	accountName: string;
	accountNumber: string;
	ifsc: string;
	isUserOwned: boolean;
};

export async function AddNewAccount(body: AddAccountBody) {
	const command = new PutCommand({
		TableName: "Transactions",
		Item: {
			pk: `ACC#${body.accountName}`,
			sk: `ACC#${body.accountName}`,
			AccountName: body.accountName,
			BankDetails: {
				AccountNumber: body?.accountNumber,
				IFSC: body?.ifsc,
			},
			IsUserOwned: body.isUserOwned,
		} satisfies Account,
		ConditionExpression: "attribute_not_exists(pk)",
	});

	try {
		const response = await docClient.send(command);

		return response;
	} catch (err) {
		console.log('err -->', err);

		return err as PutCommandOutput;
	}
}
