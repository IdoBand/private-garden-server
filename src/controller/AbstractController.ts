import { FileData } from "../types"
export abstract class AbstractController {
    decideFileData(file: Express.Multer.File): FileData {
        const fileData = {
            buffer: undefined,
            mimetype: ''
        }
        if (file) {
            fileData.buffer = file.buffer,
            fileData.mimetype = file.mimetype || ''
        }
        return fileData
    }
    decideMultipleFilesData(files: Express.Multer.File[]) {
        return files.map(file => {return this.decideFileData(file)})
    }
}