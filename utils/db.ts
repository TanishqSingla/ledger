import { DynamoDBClient } from "https://esm.sh/@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "https://esm.sh/@aws-sdk/lib-dynamodb";

export const kv = await Deno.openKv();

const dynamoClient = new DynamoDBClient({
	endpoint: "http://localhost:8000",
	region: "ap-south-1",
	credentials: {
		accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID"),
		secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY"),
	},
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);
