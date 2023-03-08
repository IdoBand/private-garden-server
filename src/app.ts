import express, { Request, Response } from 'express';
import cors from 'cors';
// import { connectToMongo } from './mongo/mongoClient';
import {Dao} from './dao/PlantDao'
import { upload } from './multerStorageConfig';

const app = express();
let PlantDao: Dao = new Dao();
app.use(cors());
app.use(express.json())

app.post('/addPlant', upload.single('plantImage'), async (req: Request, res: Response) => {
  try {
    await PlantDao.addPlant(req.body.plantName, req.file.originalname)
    res.status(200).send('Plant was saved successfully!')
  } catch (err){
    res.status(400).send('Failed to save plant.')
  }
})

app.get('/getEntireGarden', async (req: Request, res: Response) => {
  try {
    const entireGarden = await PlantDao.getEntireGarden()
    res.status(200).json(entireGarden)
} catch (err) {
  res.status(400).send('Failed to get entire garden.')
}
})

app.get('/removePlant', async (req: Request, res: Response) => {
  try {
    await PlantDao.removePlant(req.query.id as string)
    res.status(200).send('Plant was removed successfully!')
} catch (err) {
    res.status(400).send('Failed to remove plant.')
}
})
export default app;
