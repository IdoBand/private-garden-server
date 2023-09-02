import { PlantModel } from '../models';
import { AbstractDao } from "./AbstractDao"
import { FileData, Plant } from '../types'
export class PlantDao extends AbstractDao {

    #model: typeof PlantModel
    #s3FolderName: string
    constructor() {
        super()
        this.#model = PlantModel
        this.#s3FolderName = 'plantImg'
    }
    async getPlantById(plantId: string) {
        try {
            const plant = await PlantModel.findById(plantId)
            if (plant.img) {
                plant.img = await this.generateAwsImageUrl(plant.img)
            }
            return plant
        } catch (err) {
            console.log(`Failed to get plant ${plantId}.` + err)
            throw err
        }
    }
    async add(plant: Plant, fileData: FileData) {
        const img = await this.decideImageFile(fileData, this.#s3FolderName)
        const savePlant = new PlantModel({
            userId: plant.userId,
            plantName: plant.plantName,
            dateAdded: plant.dateAdded,
            img: img})
        try {
            const result = await savePlant.save()
            console.log('Plant was successfully saved!')
            return result
        }catch(err) {
            console.log('Failed to save Plant' + err)
            throw err
        }
    }
    async edit(plantEdit: Plant, fileData: FileData) {
        const plantId = plantEdit._id
        let imgName = ''
        try {
            const existingPlant = await this.#model.findById(plantId)
            if (existingPlant.img) {
                // take exiting name in order to overwrite it in s3 bucket
                imgName = existingPlant.img
                if (fileData.buffer) {
                    // overwrite the image in s3 bucket only if the user sent a new one
                    await this.s3.put(fileData, this.#s3FolderName, imgName)
                }
            } else {
                // no existing image --> generate a new Name and save it or return an empty string
                imgName = await this.decideImageFile(fileData, this.#s3FolderName)
            }
            plantEdit.img = imgName
            const response = await PlantModel.findByIdAndUpdate(plantId, plantEdit)
            return response
        } catch (err) {
            console.log('Failed to edit plant. ' + err);
            throw err
        }
    }
    async generateAwsImageUrl (imageS3Name: string) {
        const url = await this.s3.read(`${this.#s3FolderName}/${imageS3Name}`)
        return url
    }
    generateImagePath(imageS3Name: string): string {
        return `${this.#s3FolderName}/${imageS3Name}`
    }
    async delete(id: string) {
        // 1. get plant
        // 2. check if plant has image
        // 3. image ? delete it : continue
        // 4.           image deletion ? 
        //      successful   :   not successful
        // 5.  delete plant        throw error
        try {
            const plant = await this.#model.findById(id)
            if (plant.img) {
                const imgPath = this.generateImagePath(plant.img)
                const deleteFromS3Bucket = await this.s3.delete(imgPath)
            }
            const response = await this.#model.findByIdAndDelete(id)
            return response
        } catch (err) {
            console.log(`Failed to remove plant:`, id)
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
            console.log('Error occurred while deleting many plants');
            console.log(err);
        }
    }
    async getGarden(userId: string) {
        try {
            const garden = await PlantModel.find({ userId: userId })
            const gardenWithImages = await Promise.all(garden.map(async (plant) => {
                if (plant.img) {
                    const url = await this.generateAwsImageUrl(plant.img)
                    plant.img = url
                }
                return plant
            }))
            return gardenWithImages
        } catch (err) {
            console.log(`Failed to get garden for ${userId}`);
        }
    }
}