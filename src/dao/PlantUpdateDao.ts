import { FileData, Irrigation, PlantUpdate } from '../types';
import { PlantUpdateModel } from '../models';
import { AbstractDao } from "./AbstractDao";

export class PlantUpdateDao extends AbstractDao{
    #model: typeof PlantUpdateModel
    #s3FolderName: string
    constructor() {
        super()
        this.#model = PlantUpdateModel
        this.#s3FolderName = 'plantUpdateImage'
    }
    deicideIrrigation(irrigation: string, waterQuantity: number, fertilizer: string, fertilizerQuantity: number): Irrigation {
        // since the request is 'content-type: form-data'
        if (irrigation === 'false') { 
           return { boolean: false }
            } 
        return {
                boolean: true,
                waterQuantity: waterQuantity,
                fertilizer: fertilizer,
                fertilizerQuantity: fertilizerQuantity
        }
    }
    async add(plantUpdate: PlantUpdate, filesData: FileData[]) {
        try {
            const images = await this.decideMultipleImageFiles(filesData, this.#s3FolderName)
            const savePlantUpdate = new PlantUpdateModel({
                ...plantUpdate,
                images: images
            })
            const response = await savePlantUpdate.save()
            return response
        } catch (err) {
            console.log('Failed to save update' + err)
            throw err
        }
    }
    async delete(id: string) {
        /**
         * Unlike 'delete' and 'deleteMany' methods that deletes updates by updates ids,
         * this method deletes all updates that belong to a unique plant.
         * 1. get update
         * 2. check if update has images
         * 3. images ? delete them : continue
         * 4.         images deletion ? 
         *      successful   :   not successful
         * 5.  delete update        throw error
         */
        try {
            const plantUpdate = await this.#model.findById(id)
            if (plantUpdate.images.length > 0) {
                const deleteFromS3Bucket = await this.s3.deleteMultiple(plantUpdate.images, this.#s3FolderName)
            }
            const response = await this.#model.findByIdAndDelete(id)
            return response
        } catch (err) {
            console.log(`Failed to remove update:`, id)
            console.log(err)
            throw err
        }
    }
    async deleteMany(ids: string[]) {
        try {
            const response = await Promise.all(ids.map(async (id) => {
                const deletion = await this.delete(id)
                return deletion
            }))
            return response
        } catch (err) {
            console.log('Error occurred while deleting many plant updates');
            console.log(err);
        }
    }
    async deleteAllByPlantId(plantIds: string[]) {
        /**
         * Unlike 'delete' and 'deleteMany' methods that deletes updates by updates ids,
         * this method deletes all updates that belong to a unique plant.
         * 1. get all updates by plant id.
         * 2. iterate over the updates.
         * 3. for each update iterate over images array to delete all images from s3 bucket.
         * 4. delete update.
         * 5. repeat for next plant.
         */
        let currentPlantId =''
        try {
            const response = await Promise.all(plantIds.map( async (plantId) => {
                currentPlantId = plantId
                const updates = await this.#model.find({ plantId })
                const updatesDeletion = await Promise.all(updates.map( async (update) => {
                    if (update.images.length > 0) {
                        const deleteFromS3Bucket = await this.s3.deleteMultiple(update.images, this.#s3FolderName)
                    }
                    const response = await this.#model.findByIdAndDelete(update._id)
                    return response
                }))
                return updatesDeletion 
            }))
            return response
        } catch (err) {
            console.log(`Failed to remove plant updates in the process of deleting an entire plant`)
            console.log(`plant id:`, currentPlantId)
            console.log(err);
            throw err
        }
    }
    async getPlantUpdates(plantId: string) {
        try {
            const plantUpdates = await PlantUpdateModel.find({ plantId: plantId })
            const plantUpdatesWithImages = await Promise.all(plantUpdates.map( async (update) => {
                const updateImages = await this.s3.readMultiple(update.images, this.#s3FolderName)
                update.images = updateImages
                return update
            }))
            return plantUpdatesWithImages
        } catch (err) {
            console.log(`Failed to get updates for ${plantId}`);
            throw err
        }
    }
    async edit(plantUpdate: PlantUpdate, filesData: FileData[]) {
        try {
            const exitingUpdate = await this.#model.findById(plantUpdate._id)
            if (exitingUpdate.images.length > 0) {
                const deleteFromS3Bucket = await this.s3.deleteMultiple(exitingUpdate.images, this.#s3FolderName)
            }
            const imageNames = await this.s3.putMultiple(filesData, this.#s3FolderName)
            plantUpdate.images = imageNames
            const response = await PlantUpdateModel.findByIdAndUpdate(plantUpdate._id, plantUpdate)
            return response
        } catch (err) {
            console.log('Failed to edit update' + err)
            throw err
        }
    }
}