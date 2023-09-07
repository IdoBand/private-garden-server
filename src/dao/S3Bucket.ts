import s3BucketClient from "../clients/awsS3BucketConnection";
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';
import crypto from 'crypto'
import { FileData } from "../types";
dotenv.config();
export class S3BucketManager {
    #client: S3Client
    constructor() {
        this.#client = s3BucketClient()
    }

    async put(fileData: FileData ,folderName: string, existingName?: string) {
        const randomImageName = existingName? existingName : this.generateRandomImageName()
        try {
            const putCommand = new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: `${folderName}/${randomImageName}`,
                Body: fileData.buffer as Buffer,
                ContentType: fileData.mimetype
            })
            const response = await this.#client.send(putCommand)
            
            return { response, randomImageName }
        } catch (err) {
            console.log('Failed to PUT into s3 bucket');
            console.log(err);
            throw err
        }
    }

    async read(s3Path: string): Promise<string> {
        /**
         * marked out is the s3 client thats connecting to IAM user with a non public access.
         * Currently all images are accessible by a GET request to any origin so there is no need to create access.
         */
        try {
            // const readCommand = new GetObjectCommand({
            //     Bucket: process.env.BUCKET_NAME,
            //     Key: s3Path
            // })
            // const url = await getSignedUrl(this.#client, readCommand, {expiresIn: 3600})
            // return url
            return `https://private-garden-s3.s3.eu-north-1.amazonaws.com/${s3Path}`
        } catch (err) {
            console.log('Failed to READ from s3 bucket');
            throw err
        }
    }
    async delete(s3Path: string) {
        try {
            const deleteCommand = new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: s3Path
            })
            const response = await this.#client.send(deleteCommand)
            if (!(response.$metadata.httpStatusCode === 204)) {
                throw new Error(`Failed to delete image from S3`)
            }
            return response
        } catch (err) {
            console.log('error occurred at path:', s3Path);
            throw err
        }
    }
    private generateRandomImageName(): string {
        return crypto.randomBytes(32).toString('hex') 
    }
    async putMultiple(filesData: FileData[], folderName: string): Promise<string[]> {
        try {
            const imageNames = await Promise.all(filesData.map( async (filesData) => {
                const{ response, randomImageName } = await this.put(filesData, folderName)
                return randomImageName
            }))
            return imageNames
        } catch (err) {
            console.log('Failed while putting multiple', err);
            throw err
        }
    }
    async readMultiple(imagesS3Names: string[], folderName: string): Promise<string[]> {
        try {
            const urls = await Promise.all(imagesS3Names.map(async (name) => {
                const url = await this.read(`${folderName}/${name}`)
                return url
            }))
            return urls
        } catch (err) {
            console.log('Failed while reading multiple', err);
            throw err
        }
    }
    async deleteMultiple(imagesS3Names: string[], folderName: string) {
        try {
            const responses = await Promise.all(imagesS3Names.map( async (name) => {
                const response = await this.delete(`${folderName}/${name}`)
                return response
            }))
            return responses
        } catch (err) {
            console.log('Failed while deleting multiple', err);
            throw err
        }
        
    }
}