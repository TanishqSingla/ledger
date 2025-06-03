import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "https://deno.land/x/aws_sdk@v3.32.0-1/client-s3/mod.ts";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
	region: "ap-south-1",
	credentials: {
		accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
		secretAccessKey: Deno.env.get("SECRET_ACCESS_KEY")!,
	},
});

export const uploadFile = async (key: string, body: Blob, type?: string) => {
	const bucketName = Deno.env.get("STORAGE_BUCKET_NAME");
	if (!bucketName) throw new Error("bucket not found");

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: key,
		Body: body,
		ContentType: type,
	});

	const response = await s3Client.send(command);
	return response;
};

export const getFile = async (key: string) => {
	const bucketName = Deno.env.get("STORAGE_BUCKET_NAME");
	if (!bucketName) throw new Error("bucket not found");

	const command = new GetObjectCommand({
		Bucket: bucketName,
		Key: key,
	});

	try {
		//@ts-ignore messed up library types
		const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
		return url;
	} catch (error) {
		console.error("Error downloading file", error);
	}
};

export async function delete_file(id: string) {
	const bucketName = Deno.env.get("STORAGE_BUCKET_NAME");
	if (!bucketName) throw new Error("bucket not found");

	const command = new DeleteObjectCommand({ Bucket: bucketName, Key: id });
	
	try {
		const resp = await s3Client.send(command);

		return resp;
	} catch (err) {
		console.error("Error deleting file", err);
	}
}
