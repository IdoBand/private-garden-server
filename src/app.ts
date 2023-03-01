import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const app = express();

app.use(cors());
app.use(express.json())

const url = 'mongodb://localhost:27017/?authMechanism=DEFAULT'
const DBname = 'private-garden-db'

// async function connectToMongo() {
//         const client = new MongoClient(url);
//         await client.connect()
//             .then(() => console.log('successfully connected to Mongo'))
//             .catch(e => console.log(e))
 
// }
let dbConnection
function connectToMongo() {
    MongoClient.connect(url)
    .then(client => {
        dbConnection = client.db()
    })
    .catch(err => console.log(err))
}

connectToMongo()


const port = 8000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at port ${port}`);
});