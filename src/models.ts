import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema({
    plantName: String,
    dateAdded: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  });

export const PlantModel = mongoose.model('PlantModel', PlantSchema, 'plants')

const PlantUpdateSchema = new mongoose.Schema({
  plantId: String,
  plantName: String,
  dateAdded: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  irrigation: {
    boolean: Boolean,
    waterQuantity: Number,
    fertilizer: String,
    fertilizerQuantity: Number
  },
  notes: String
})

export const PlantUpdateModel = mongoose.model('PlantUpdate', PlantUpdateSchema, 'updates')