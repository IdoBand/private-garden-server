import mongoose from "mongoose";
const DB_NAME = 'private-garden'
const URL = `mongodb://127.0.0.1:27017/${DB_NAME}`;

let connection;
export async function connectToMongo() {
    try {
        const defaultConnection = await mongoose.connect(URL)
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