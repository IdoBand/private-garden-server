import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

let s3: S3Client | undefined;
export async function connectToS3Bucket() {
    try {
        const clientConnection = new S3Client({
            credentials: {
                accessKeyId: process.env.BUCKET_ACCESS_KEY,
                secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY
            },
            region: process.env.BUCKET_REGION
        })
        s3 = clientConnection
        console.log("AWS S3 Bucket connection - ", true);
        
    } catch (err) {
        console.log("AWS S3 Bucket connection - ", false);
        console.log(err);
    }
}
export default function s3BucketClient() {
    if (!s3) { throw new Error('ERROR! you are not connected to your S3 Bucket!')}
    return s3;
}