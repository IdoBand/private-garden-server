import mongoose from "mongoose";
const COLLECTION_NAME = 'private-garden'

///////////////////
import dotenv from 'dotenv';
dotenv.config();
const URI = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@privategardencluster.r0jht4o.mongodb.net/${COLLECTION_NAME}?retryWrites=true&w=majority`
///////////////////
let connection: typeof mongoose | undefined
export async function connectToMongo() {
    try {
        const defaultConnection = await mongoose.connect(URI)
        console.log("Mongoose connection - ", true)
        connection = defaultConnection;
    } catch (err) {
        console.log("Mongoose connection - ", false)
        console.log(err);
        process.exit(1);
    }
}
    
export default function mongoosePool() {
    if (!connection) { throw new Error('you must connect before trying to use client')}
    return connection;
}