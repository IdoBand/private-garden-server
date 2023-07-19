import { PlantModel } from '../models';
import { AbstractDao } from "./AbstractDao"
import { Plant, PlantEdit } from '../types'
export class PlantDao extends AbstractDao {

    model: typeof PlantModel
    constructor() {
        super()
        this.model = PlantModel
    }

    async addPlant(name: string, imageName: string) {
        const savePlant = new PlantModel({
            plantName: name,
            dateAdded: this.dateValidator(),
            img: this.deicideImage(imageName)})
        try {
            const result = await savePlant.save()
            console.log('Plant was successfully saved!')
            return result
        }catch(err) {
            console.log('could not save image' + err)
            throw err
        }
         
    }
    async getEntireGarden() {
        try {
            return await PlantModel.find()
        } catch (err) {
            console.log('Failed to get entire garden.' + err)
            throw err
        }
    }
    async getPlantById(plantId: string) {
        try {
            const plant = await PlantModel.findById(plantId)
            return plant
        } catch (err) {
            console.log(`Failed to get plant ${plantId}.` + err)
            throw err
        }
    }
    async removePlants(idsArray: string[]) {
        try {
            await PlantModel.deleteMany({_id: {$in: idsArray}})
        } catch (err) {
            console.log(`Failed to remove plant` + err)
            throw err
        }
    }
    async editPlant(plantId: string, newInfoObject: PlantEdit){
        if (!newInfoObject.plantName) {
            delete newInfoObject.plantName
        }
        if (!newInfoObject.img) {
            delete newInfoObject.img
        } else {
            const img = this.deicideImage(newInfoObject.img as string)
            newInfoObject.img = img
        }
        try {
            const response = await PlantModel.findByIdAndUpdate(
                plantId,
                newInfoObject
                )
                return response
        } catch (err) {
            console.log('Failed to update plant. ' + err)
            throw err
        }
    }
    async add(plant: Plant, imageName: string) {
        const savePlant = new PlantModel({
            userId: plant.userId,
            plantName: plant.plantName,
            dateAdded: plant.dateAdded,
            img: this.deicideImage(imageName)})
        try {
            const result = await savePlant.save()
            console.log('Plant was successfully saved!')
            return result
        }catch(err) {
            console.log('could not save image' + err)
            throw err
        }
    }
    async edit(plant: Plant, imageName: string) {
        plant.img = this.deicideImage(imageName)
        try {
            await PlantModel.findByIdAndUpdate(plant._id, plant)
        } catch (err) {
            console.log('Failed to edit plant. ' + err);
            throw err
        }
    }
    async delete(ids: string[]) {
        try {
            await PlantModel.deleteMany({_id: {$in: ids}})
        } catch (err) {
            console.log(`Failed to remove plant` + err)
            throw err
        }
    }
    async getGarden(userId: string ) {
        try {
            const garden = await PlantModel.find({ userId: userId })
            return garden
        } catch (err) {
            console.log(`Failed to get garden for ${userId}`);
        }
    }
}