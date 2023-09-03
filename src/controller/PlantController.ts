import { AbstractController } from './AbstractController';
import { Router, Request, Response } from 'express';
import { PlantDao } from '../dao/PlantDao';
import { upload } from '../multerStorageConfig';
import { Plant } from '../types';
import { PlantUpdateDao } from '../dao/PlantUpdateDao';

export class PlantController extends AbstractController {
  plantDao: PlantDao
  plantUpdateDao: PlantUpdateDao
  router: Router

  constructor() {
    super()
    this.router = Router()
    this.plantDao = new PlantDao()
    this.plantUpdateDao = new PlantUpdateDao()
    this.setRoutes()
  }
  setRoutes() {
    this.router.get('/:userId', this.getGarden)
    this.router.post('/', upload.single('plantImage'), this.addPlant)
    this.router.patch('/:id', upload.single('plantImage'), this.editPlant)
    this.router.get('/:userId/:id', this.getPlantById)
    this.router.post('/delete', this.deletePlant)
  }
  getRouter() {
    return this.router
  }
  getGarden = async (req: Request, res: Response) => {
    try {
      const garden = await this.plantDao.getGarden(req.params.userId)
      const response = {
        success: true,
        message: '',
        data: garden
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err) {
        res.status(400).send(JSON.stringify({message: 'Failed to get entire garden.'}))
    }
  }
  addPlant = async (req: Request, res: Response) => {

    const fileData = this.decideFileData(req.file)
    const newPlant: Plant = JSON.parse(req.body.plant)
    try {
      const result = await this.plantDao.add(newPlant, fileData)
      const response = {
        success: true,
        message: 'Plant was saved successfully!',
        data: result._id
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err){
      res.status(400).send(JSON.stringify({message: 'Failed to save plant.'}))
    }
  }
  editPlant = async (req: Request, res: Response) => {
    const fileData = this.decideFileData(req.file)
    const plantEdit: Plant = JSON.parse(req.body.plant)
    try {
      await this.plantDao.edit(plantEdit, fileData)
      const response = {
        success: true,
        message: 'Plant was edited successfully!'
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err){
      res.status(400).send(JSON.stringify({message: 'Failed to save plant.', success: false}))
    }
  }
  getPlantById = async (req: Request, res: Response) => {
    try {
      const plant = await this.plantDao.getPlantById(req.params.id)
      res.status(200).send(JSON.stringify({success: true, message: 'query successful', data: plant}))
    } catch (err) {
      res.status(500).send(JSON.stringify({message: 'Failed to get plant. Url or plant id might be incorrect.'}))
    }
  }
  deletePlant = async (req: Request, res: Response) => {
    const ids = req.body.ids
    if (ids && ids.length > 0) {
      try {
        await this.plantUpdateDao.deleteAllByPlantId(ids)
        await this.plantDao.deleteMany(ids)
      } catch (err) {
        res.status(400).send(JSON.stringify({success: false, message: 'Bad request. ids could be empty or maybe a mismatch between update and plant ids.'}))
      }
      res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
    } else {
      res.status(500).send(JSON.stringify({success: false, message: 'Failed to delete plants. ids could be empty'}))
    }
  }
}