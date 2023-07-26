import { PlantModel } from '../models';
import { AbstractDao } from "./AbstractDao"
import { Plant, PlantEdit } from '../types'
export class PlantDao extends AbstractDao {

    model: typeof PlantModel
    constructor() {
        super()
        this.model = PlantModel
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
            console.log('Failed to save Plant' + err)
            throw err
        }
    }
    async edit(plant: Plant, imageName: string) {
        try {
            plant.img = this.deicideImage(imageName)
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
    async getGarden(userId: string) {
        try {
            const garden = await PlantModel.find({ userId: userId })
            return garden
        } catch (err) {
            console.log(`Failed to get garden for ${userId}`);
        }
    }
}