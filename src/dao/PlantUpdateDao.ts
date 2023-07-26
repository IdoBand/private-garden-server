import { Irrigation, PlantUpdate } from 'src/types';
import { PlantUpdateModel } from '../models';
import { AbstractDao } from "./AbstractDao";
import { Error } from 'mongoose';

export class PlantUpdateDao extends AbstractDao{
    model: typeof PlantUpdateModel
    constructor() {
        super()
        this.model = PlantUpdateModel
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
    async editUpdateById(updateId: string, newInfo: PlantUpdate) {
        try {
            const response = await PlantUpdateModel.findByIdAndUpdate(
                updateId,
                newInfo
            )
            return response
        } catch (err) {
            console.log('Failed to remove some or all updates.' + err)
            throw err
        }
    }
    async add(plantUpdate: PlantUpdate, imageNamesArray: string[]) {
        try {
            const images = imageNamesArray.map(image => {
                return this.deicideImage(image)
            })
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
    async delete(ids: string[]) {
        try {
            const response = await PlantUpdateModel.deleteMany({_id: {$in: ids}})
            if (response.deletedCount === 0 || response.acknowledged === false) {
                throw Error
            }  
        } catch (err) {
            console.log(`Failed to remove plant` + err)
            throw err
        }
    }
    async deleteAllByPlantId(plantId: string) {
        try {
            const response = await PlantUpdateModel.deleteMany({plantId: plantId})
            if (response.acknowledged === false) {
                throw Error
            }  
        } catch (err) {
            console.log(`Failed to remove plant` + err)
            throw err
        }
    }
    async getPlantUpdates(plantId: string) {
        try {
            const plantUpdate = await PlantUpdateModel.find({ plantId: plantId })
            return plantUpdate
        } catch (err) {
            console.log(`Failed to get garden for ${plantId}`);
            throw err
        }
    }
    async edit(plantUpdate: PlantUpdate, imageNamesArray: string[]) {
        try {
            plantUpdate.images = imageNamesArray.map(image => {return this.deicideImage(image)})
            const response = await PlantUpdateModel.findByIdAndUpdate(plantUpdate._id, plantUpdate)
            return response
        } catch (err) {
            console.log('Failed to edit update' + err)
            throw err
        }
    }
}