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
    async addUpdate(dateAdded: string , plantId: string, plantName: string, imageName: string | undefined, irrigation: boolean, 
                    waterQuantity: number, fertilizer: string, fertilizerQuantity: number, 
                    notes: string){
        const date = this.dateValidator(dateAdded)
        console.log(typeof(irrigation));
        
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
        }
    }
    deicideIrrigation(irrigation, waterQuantity, fertilizer, fertilizerQuantity) {
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
    // deicideImage(imageName: string) {
    //     if (imageName) {
    //         return {
    //             data: fs.readFileSync(`${process.cwd()}/images/` + imageName),
    //             contentType: 'image/jpg'}
    //     }
    //     return 'no image was uploaded'
    // }
    async getAllUpdatesByPlantId(plantId: string) {
        try {
            const updates = await PlantUpdateModel.find({ plantId: plantId });
            return updates
        }catch(err) {
            console.log('Failed to get all updates.' + err)
        }
    }
    
}