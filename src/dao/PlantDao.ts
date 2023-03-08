import mongoose from "mongoose";
import { PlantModel } from '../models';
import fs from 'fs'

export class Dao {
    db: string
    schema: any
    constructor() {
        this.db = 'private-garden'
        this.connectToMongoose()
        this.schema = PlantModel
    }
    async connectToMongoose() {
        try {
            await mongoose.connect(`mongodb://127.0.0.1:27017/${this.db}`)
            console.log('Mongoose connection successful!')
          } catch (err) {
            console.log('Could not connect to Mongo' + err)
          }
    }
    dateValidator(date?: string | null) {
        if (date) {return date}
        const newDate = new Date(); 
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'} as const;
        const dateString = newDate.toLocaleDateString('en-US', options);
        return dateString;
      }
    async addPlant(name: string, imageName: string) {
        const savePlant = new PlantModel({
            plantName: name,
            irrigations: [],
            dateAdded: this.dateValidator(),
            img: {
              data: fs.readFileSync(`${process.cwd()}/images/` + imageName),
              contentType: 'image/jpg'}
            })
        try {
            await savePlant.save()
            console.log('image was successfully saved!')
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
    async removePlant(id: string) {
        try {
            await PlantModel.findByIdAndDelete({_id: id})
        } catch(err) {
            console.log('Failed to remove plant.' + err)
        }
    }
    async editPlant(){
        return
    }
}

////////////     O L D    D A O
// import { MongoClient } from "mongodb";
// import dbClient from "../mongo/mongoClient";
// const DBname = 'private-garden-db';


// export class Dao {
//     client: MongoClient;
//     db: any
//     collection: any
//     constructor() {
//         this.client = dbClient();
//         this.db = this.client.db(DBname)
//         this.collection = this.db.collection('plants')
//     }
//     async addPlant(name: string, image: File | Express.Multer.File) {
//         const newPlant = {
//             name: name,
//             dateAdded: '',
//             irrigations: [],
//             mainImage: image
//         }
//         try {
//             const result = await this.collection.insertOne(newPlant)
//             return result
//         }catch(err) {
//                 console.log(err)
//             }
         
//     }
  
// }