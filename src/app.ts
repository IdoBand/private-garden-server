import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongo } from './mongo/mongooseConnection'
import { upload } from './multerStorageConfig';
import bodyParser from 'body-parser';
import { PlanetNetDao } from './dao/PlanetNetDao';
import plantsRoute from './controller/plantsRoute';
import plantUpdatesRoute from './controller/plantUpdatesRoute'
import usersRoute from './controller/userRoute'
import postsRoute from './controller/postsRoute'

const app = express()

let planetNetDao: PlanetNetDao
export async function initiateApp() {
  await connectToMongo()
  planetNetDao = new PlanetNetDao() 
}

app.use(cors());
app.use(bodyParser.json())
app.use('/plants', plantsRoute)
app.use('/plantUpdates', plantUpdatesRoute)
app.use('/users', usersRoute)
app.use('/posts', postsRoute)

app.get('/test', (req: Request, res: Response) => {
  res.send('Server is up and running!')})

///////////////////        P l @ n t    N e t    A P I        ///////////////////

app.post('/IdentifyPlant', upload.array('plantImages'), async (req: Request, res: Response) => {
  const originalImageNames: string[] = []
  if (req.files) {
    const files = req.files as Express.Multer.File[];
    for (let i = 0; i < files.length; i++) {
    originalImageNames.push(files[i].originalname)
    }

    try {
      const responseObject = await planetNetDao.fetchIdentifyPlantPost(originalImageNames)
      res.send(JSON.stringify({success: true, message: 'Identify request successful', data: responseObject.bestMatch}))
    } catch (err) {
        const errorMessage = 'Failed to identify'
        console.log(errorMessage + err);
        res.send(JSON.stringify({success: false, message: errorMessage}))
    }
  }
})

export default app;