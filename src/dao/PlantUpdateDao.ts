import mongoose, { Model, Connection, Collection } from "mongoose";
import { PlantUpdateModel } from '../models';
import mongoosePool from '../mongo/mongooseConnection';
import { AbstractDao } from "./AbstractDao";

export class PlantUpdateDao extends AbstractDao{
    model: any
    constructor() {
        super()
        this.model = PlantUpdateModel
    }
    async addUpdate(dateAdded: string , plantId: string, plantName: string, imageName: string, irrigation: string, 
                    waterQuantity: number, fertilizer: string, fertilizerQuantity: number, 
                    notes: string){
        const date = this.dateValidator(dateAdded)
        const irrigationProperties = this.deicideIrrigation(irrigation, waterQuantity, fertilizer, fertilizerQuantity)
        const img = this.deicideImage(imageName)
        
        const saveUpdate = new PlantUpdateModel({
            plantId: plantId,
            plantName: plantName,
            dateAdded: date,
            img: img,
            irrigation: irrigationProperties,
            notes: notes
        })
        try {
            const result = await saveUpdate.save()
            console.log('Document saved successfully:');
            return result._id.toString()
        } catch (err){
            console.log('oopsi poopsi' + err)
            throw err
        }
    }
    deicideIrrigation(irrigation: string, waterQuantity: number, fertilizer: string, fertilizerQuantity: number) {
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
    async getAllUpdatesByPlantId(plantId: string) {
        try {
            const updates = await PlantUpdateModel.find({ plantId: plantId });
            return updates
        }catch(err) {
            console.log('Failed to get all updates.' + err)
            throw err
        }
    }
    async removeUpdates(idsArray: string[]) {
        try {
            const response = await PlantUpdateModel.deleteMany({_id: {$in: idsArray}})
            console.log(response)
        } catch (err) {
            console.log('Failed to remove some or all updates.' + err)
            throw err
        }
    }
    async editUpdateById(updateId: string, newInfo) {
        console.log(`edit update, updateId: updateId`);
        try {
            console.log('trying to save update', newInfo);
            
            const response = await PlantUpdateModel.findByIdAndUpdate(
                updateId,
                newInfo
            )
            console.log(`response from trying to save: ${response}`)
        } catch (err) {
            console.log('Failed to remove some or all updates.' + err)
            throw err
        }
    }
}