import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongo } from './clients/mongooseConnection'
import { connectToS3Bucket } from './clients/awsS3BucketConnection'
import bodyParser from 'body-parser';
import { UserController } from './controller/UserController';
import { PostController } from './controller/PostController';
import { PlantUpdateController } from './controller/PlantUpdateController';
import { PlantController } from './controller/PlantController';
import { PlanetNetController } from './controller/PlanetNetController';

const app = express()

app.use(cors());
app.use(bodyParser.json())

let planetNetController: PlanetNetController
let userController: UserController
let postController: PostController
let plantUpdateController: PlantUpdateController
let plantController: PlantController
export async function initiateApp() {
  await connectToMongo()
  await connectToS3Bucket()
  planetNetController = new PlanetNetController()
  userController = new UserController()
  postController = new PostController()
  plantUpdateController = new PlantUpdateController()
  plantController = new PlantController()
  app.use('/planetNet', planetNetController.getRouter())
  app.use('/plants', plantController.getRouter())
  app.use('/plantUpdates', plantUpdateController.getRouter())
  app.use('/posts', postController.getRouter())
  app.use('/users', userController.getRouter())
}

app.get('/test', (req: Request, res: Response) => {
  res.send('Server is up and running!')})

export default app;