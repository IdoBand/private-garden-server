import  fs  from "fs";
import { S3BucketManager } from "./S3Bucket";
import { FileData } from "../types";
export abstract class AbstractDao {
    s3: S3BucketManager
    constructor() {
        this.s3 = new S3BucketManager()
    }
    deicideImage(imageName: string): {data: Buffer | [] , contentType: string} {
        if (imageName) {
            try {
                const img = {
                    data: this.fsReadFileSync(imageName),
                    contentType: 'image/jpg'
                }
                this.removeImageFromStorage(imageName)
                return img
            } catch (err) {
                console.log('Image saving process has failed' + err);
                throw err
            }
        }
        return {
            data: [],
            contentType: ''}
    }
    async decideImageFile (fileData: FileData, folderName: string): Promise<string> {
        /**
         * Being passed an object of type FileData.
         * If the object is empty the function returns an empty string.
         * If the object is not empty the function will store it in aws s3 bucket
         * @param {FileData} fileData - An object containing two properties: a Buffer and a mimetype.
         * @param {string} folderName - Target folder to save in s3 bucket.
         * @returns {string} - empty string or the name of the file thats been saved in the s3 bucket.
         */
        if (fileData.buffer) {
            try {
                const { response, randomImageName } = await this.s3.put(fileData, folderName)
                if (response.$metadata.httpStatusCode === 200) {
                    return randomImageName
                }
                throw Error
            } catch (err) {
                console.log('Image saving process has failed' + err);
                throw err
            }
        }
        return ''
    }
    async decideMultipleImageFiles(filesData: FileData[], folderName: string) {
        if (filesData.length > 0) {
            const imageNames = await Promise.all(filesData.map(async (fileData) => {
                const imageName = await this.decideImageFile(fileData, folderName)
                return imageName 
            }))
            return imageNames
        }
        return []
    }
    fsReadFileSync(imageName: string): Buffer {
        return fs.readFileSync(`${process.cwd()}/images/` + imageName)
    }
    removeImageFromStorage(imageName: string): void {
        fs.unlink(`${process.cwd()}/images/` + imageName, (err) => {
            if (err) {
                console.log('Failed to delete image file' + err);
                throw err
            }
            console.log('Image file was deleted successfully');
        })
    }
    deicideMultipleImages(imageNamesArray: string []) {
        return imageNamesArray.map(imageName => {
            return this.deicideImage(imageName)
        })
    }
}


