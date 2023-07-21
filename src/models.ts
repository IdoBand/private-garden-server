import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema({
    plantName: String,
    dateAdded: Date,
    userId: String,
    img: {
      data: Buffer,
      contentType: String,
    },
  });

export const PlantModel = mongoose.model<typeof PlantSchema>('PlantModel', PlantSchema, 'plants')

const PlantUpdateSchema = new mongoose.Schema({
  plantId: String,
  userId: String,
  dateAdded: Date,
  notes: String,
  images: [{
    data: Buffer,
    contentType: String,
  }],
  irrigation: {
    boolean: Boolean,
    waterQuantity: Number,
    fertilizer: String,
    fertilizerQuantity: Number
  },
});

export const PlantUpdateModel = mongoose.model<typeof PlantUpdateSchema>('PlantUpdate', PlantUpdateSchema, 'updates')