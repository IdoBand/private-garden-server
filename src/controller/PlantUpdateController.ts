import { AbstractController } from './AbstractController';
import { Router, Request, Response } from 'express';
import { upload } from '../multerStorageConfig';
import { PlantUpdateDao } from '../dao/PlantUpdateDao';

export class PlantUpdateController extends AbstractController {
  updateDao: PlantUpdateDao
  router: Router
  constructor() {
    super()
    this.router = Router()
    this.updateDao = new PlantUpdateDao()
    this.setRoutes()
  }
  setRoutes() {
    this.router.post('/', upload.array('updateImages'), this.addPlantUpdate)
    this.router.patch('/:id', upload.array('updateImages'), this.editPlantUpdate)
    this.router.get('/:plantId', this.getPlantUpdates)
    this.router.post('/delete', this.deleteUpdate)
  }
  getRouter() {
    return this.router
  }
  addPlantUpdate = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const filesData = this.decideMultipleFilesData(files)
    try {
      const newUpdateId = await this.updateDao.add(JSON.parse(req.body.plantUpdate), filesData)
      res.status(200).send(JSON.stringify({success: true, message: 'Update added successfully!', data: newUpdateId}))
    } catch (err) {
      console.log( 'Failed to save Update.', err)
      res.status(400).send(JSON.stringify({success: false, message: 'Failed to save Update.'}))
    }
  }
  editPlantUpdate = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[]; 
    const filesData = this.decideMultipleFilesData(files)
    console.log(filesData);
    try {
      const newUpdateId = await this.updateDao.edit(JSON.parse(req.body.plantUpdate), filesData)
      res.status(200).send(JSON.stringify({success: true, message: 'Update added successfully!', data: newUpdateId}))
    } catch (err) {
      console.log( 'Failed to save Update.', err)
      res.status(400).send(JSON.stringify({success: false, message: 'Failed to save Update.'}))
    }
  }
  getPlantUpdates = async (req: Request, res: Response) => {
    try {
      const plantUpdates = await this.updateDao.getPlantUpdates(req.params.plantId)
      const response = {
        success: true,
        message: '',
        data: plantUpdates
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      res.status(400).send(JSON.stringify({success: false, message: 'Failed to get updates.'}))
    }
  }
  deleteUpdate = async (req: Request, res: Response) => {
    const ids = req.body.ids
    if (ids && ids.length > 0) {
      try {
        await this.updateDao.deleteMany(ids)
        res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
      } catch (err) {
        res.status(400).send(JSON.stringify({success: false, message: 'Failed to delete plants.'}))
      }
    } else {
      res.status(500).send(JSON.stringify({success: false, message: 'Bad request ids could be empty.'}))
    }
  }
}