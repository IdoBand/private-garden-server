import mongoose from "mongoose";
import { Comment } from "./types";
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

const UserSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  dateAdded: Date,
  lastActive: Date,
  profileImg: {
    data: Buffer,
    contentType: String,
  },
  followers: [String],
  following: [String],
});

export const UserModel = mongoose.model<typeof UserSchema>('UserModel', UserSchema, 'users')

const PostSchema = new mongoose.Schema({
  userId: String,
  images: [{
    data: Buffer,
    contentType: String,
  }],
  dateAdded: Date,
  text: String,
  comments: [{
    userId: String,
    text: String,
    dateAdded: Date
  }],
});

export const PostModel = mongoose.model<typeof PostSchema>('PostModel', PostSchema, 'posts')

const LikeSchema = new mongoose.Schema({
  userId: String,
  postId: String,
  dateAdded: Date,
});

export const LikeModel = mongoose.model<typeof LikeSchema>('LikeModel', LikeSchema, 'likes')

