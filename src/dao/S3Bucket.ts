import s3BucketClient from "../clients/awsS3BucketConnection";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto'
dotenv.config();
export class S3BucketManager {
    client: S3Client
    constructor() {
        // this.client = s3BucketClient()
    }

    async put(buffer: Buffer, fileType: string) {
        try {
            const putCommand = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: this.generateRandomImageName(),
                Body: buffer,
                ContentType: fileType
            })
            const response = await this.client.send(putCommand)
            console.log(response);
            return response
        } catch (err) {
            console.log('Failed to PUT into s3 bucket');
            
        }
    }

    async read() {
        try {

        } catch (err) {
            console.log('Failed to READ from s3 bucket');
            
        }
    }
    async delete() {
        try {

        } catch (err) {
            console.log('Failed to DELETE from s3 bucket');
            
        }
    }
    generateRandomImageName(): string {
        return crypto.randomBytes(32).toString('hex') 
    }
}