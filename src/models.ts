import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema({
    plantName: String,
    irrigations: [],
    dateAdded: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  });

export const PlantModel = mongoose.model('Image', PlantSchema)