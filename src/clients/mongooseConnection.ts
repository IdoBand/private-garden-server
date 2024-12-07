import mongoose from "mongoose";

///////////////////
import dotenv from 'dotenv';
dotenv.config();

const URI = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@privategardencluster.r0jht4o.mongodb.net/${process.env.ATLAS_COLLECTION_NAME}?retryWrites=true&w=majority&appName=PrivateGardenCluster`

///////////////////
let connection: typeof mongoose | undefined
export async function connectToMongo() {
    try {
        const defaultConnection = await mongoose.connect(URI, {connectTimeoutMS: 10000})
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