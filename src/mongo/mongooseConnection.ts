import mongoose from "mongoose";
const COLLECTION_NAME = 'private-garden'
const URL = `mongodb://127.0.0.1:27017/${COLLECTION_NAME}`;

///////////////////
import dotenv from 'dotenv';
dotenv.config();
const URI = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@privategardencluster.r0jht4o.mongodb.net/${COLLECTION_NAME}?retryWrites=true&w=majority`
///////////////////
let connection;
export async function connectToMongo() {
    try {
        const defaultConnection = await mongoose.connect(URI)
        console.log("Mongoose has successfully connected to Mongo!")
        connection = defaultConnection;
    } catch (err) {
        console.log('Mongoose could not connected to Mongo...' + err)
        process.exit(1);
    }
}
    
export default function mongoosePool() {
    if (!connection) { throw new Error('you must connect before trying to use client')}
    return connection;
}