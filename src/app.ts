import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongo } from './clients/mongooseConnection'
import { connectToS3Bucket } from './clients/awsS3BucketConnection'
import { upload } from './multerStorageConfig';
import bodyParser from 'body-parser';
import { PlanetNetDao } from './dao/PlanetNetDao';
import { UserController } from './controller/UserController';
import { PostController } from './controller/PostController';
import { PlantUpdateController } from './controller/PlantUpdateController';
import { PlantController } from './controller/PlantController';

const app = express()

let planetNetDao: PlanetNetDao
let userController: UserController
let postController: PostController
let plantUpdateController: PlantUpdateController
let plantController: PlantController
export async function initiateApp() {
  await connectToMongo()
  await connectToS3Bucket()
  planetNetDao = new PlanetNetDao()
  userController = new UserController()
  postController = new PostController()
  plantUpdateController = new PlantUpdateController()
  plantController = new PlantController()
  app.use(cors());
  app.use(bodyParser.json())
  app.use('/plants', plantController.getRouter())
  app.use('/plantUpdates', plantUpdateController.getRouter())
  app.use('/posts', postController.getRouter())
  app.use('/users', userController.getRouter())
}

app.get('/test', (req: Request, res: Response) => {
  res.send('Server is up and running!')})

///////////////////        P l @ n t    N e t    A P I        ///////////////////
////////////////        S i n g l e    E n d    P o i n t        ////////////////
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