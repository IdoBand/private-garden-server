import mongoose, { Model } from "mongoose";
import { PlantModel } from '../models';
import fs from 'fs'
import { AbstractDao } from "./AbstractDao"
export class PlantDao extends AbstractDao {

    model: any
    constructor() {
        super()
        this.model = PlantModel
    }

    async addPlant(name: string, imageName: string) {
        console.log('trying to save plant');
        const savePlant = new PlantModel({
            plantName: name,
            dateAdded: this.dateValidator(),
            img: this.deicideImage(imageName)})
        try {
            await savePlant.save()
            console.log('Plant was successfully saved!')
        }catch(err) {
            console.log('could not save image' + err)
            }
         
    }
    async getEntireGarden() {
        try {
            return await PlantModel.find()
        } catch (err) {
            console.log('Failed to get entire garden.' + err)
        }
    }
    async removePlants(idsArray: string[]) {
        try {
            await PlantModel.deleteMany({_id: {$in: idsArray}})
        } catch (err) {
            console.log(`Failed to remove plant` + err)
        }
    }
    async editPlant(plantId: string, newInfoObject){
        if (!newInfoObject.plantName) {
            delete newInfoObject.plantName
        }
        if (!newInfoObject.img) {
            delete newInfoObject.img
        } else {
            console.log(newInfoObject);
            
            const img = {
                data: fs.readFileSync(`${process.cwd()}/images/` + newInfoObject.img),
                contentType: 'image/jpg'}
            newInfoObject.img = img
        }
        try {
            const response = await PlantModel.findByIdAndUpdate(
                plantId,
                newInfoObject
                )
                return response
        } catch (err) {
            console.log('Failed to update plant.' + err)
        }
    }
}