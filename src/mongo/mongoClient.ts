import { MongoClient } from 'mongodb';
const URL = 'mongodb://127.0.0.1:27017';

let client: MongoClient;
export async function connectToMongo() {
    const defaultClient = new MongoClient(URL)
    console.log('Mongo client created')
    try {
        await defaultClient.connect()
        console.log("client has successfully connected to Mongo!")
        client = defaultClient;

    } catch (err) {
        console.log(err)
        process.exit(1);
    }
}
    
    export default function dbClient(): MongoClient {
        if (!client) { throw new Error('you must connect before trying to use client')}
        return client;
    }