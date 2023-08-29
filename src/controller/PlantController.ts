import { Router, Request, Response } from 'express';
import { PlantDao } from '../dao/PlantDao';
import { upload } from '../multerStorageConfig';
import { Plant } from '../types';
import { PlantUpdateDao } from '../dao/PlantUpdateDao';
// const plantDao = new PlantDao
// const plantUpdateDao = new PlantUpdateDao
// const router = Router()
// router.get('/:userId', async (req: Request, res: Response) => {
//   try {
//     const garden = await plantDao.getGarden(req.params.userId)
//     const response = {
//       success: true,
//       message: '',
//       data: garden
//     }
//     res.status(200).send(JSON.stringify(response))
//   } catch (err) {
//       res.status(400).send(JSON.stringify({message: 'Failed to get entire garden.'}))
//   }
//   })
// router.post('/', upload.single('plantImage'), async (req: Request, res: Response) => {
//   let imageOriginalName = '';
//   if (req.file) {
//     imageOriginalName = req.file.originalname
//   }
//   const newPlant: Plant = JSON.parse(req.body.plant)
//   try {
//     const result = await plantDao.add(newPlant, imageOriginalName)
//     const response = {
//       success: true,
//       message: 'Plant was saved successfully!',
//       data: result._id
//     }
//     res.status(200).send(JSON.stringify(response))
//   } catch (err){
//     res.status(400).send(JSON.stringify({message: 'Failed to save plant.'}))
//   }
// })
// router.patch('/:id', upload.single('plantImage'), async (req: Request, res: Response) => {
//   let imageOriginalName = '';
//   if (req.file) {
//     imageOriginalName = req.file.originalname
//   }
//   const plantEdit: Plant = JSON.parse(req.body.plant)
//   try {
//     await plantDao.edit(plantEdit, imageOriginalName)
//     const response = {
//       success: true,
//       message: 'Plant was edited successfully!'
//     }
//     res.status(200).send(JSON.stringify(response))
//   } catch (err){
//     res.status(400).send(JSON.stringify({message: 'Failed to save plant.', success: false}))
//   }
// })
// router.get('/:userId/:id', async (req: Request, res: Response) => {
//   try {
//     const plant = await plantDao.getPlantById(req.params.id)
//     res.status(200).send(JSON.stringify({success: true, message: 'query successful', data: plant}))
// } catch (err) {
//     res.status(400).send(JSON.stringify({message: 'Failed to get plant. Url or plant id might be incorrect.'}))
// }
// })
// router.post('/delete', async (req: Request, res: Response) => {
//   const ids = req.body.ids
//   if (ids && ids.length > 0) {
//     for (const id of ids) {
//       try {
//         await plantUpdateDao.deleteAllByPlantId(id)
//         await plantDao.delete([id])
//       } catch (err) {
//         res.status(400).send(JSON.stringify({success: false, message: 'Bad request. ids could be empty or maybe a mismatch between update and plant ids.'}))
//       }
//     }
//     res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
//   } else {
//     res.status(400).send(JSON.stringify({success: false, message: 'Failed to delete plants. ids could be empty'}))
//   }
// })
//   export default router;

export class PlantController {
  plantDao: PlantDao
  plantUpdateDao: PlantUpdateDao
  router: Router

  constructor() {
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
    let imageOriginalName = '';
    if (req.file) {
      imageOriginalName = req.file.originalname
    }
    const newPlant: Plant = JSON.parse(req.body.plant)
    try {
      const result = await this.plantDao.add(newPlant, imageOriginalName)
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
    let imageOriginalName = '';
    if (req.file) {
      imageOriginalName = req.file.originalname
    }
    const plantEdit: Plant = JSON.parse(req.body.plant)
    try {
      await this.plantDao.edit(plantEdit, imageOriginalName)
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
      for (const id of ids) {
        try {
          await this.plantUpdateDao.deleteAllByPlantId(id)
          await this.plantDao.delete([id])
        } catch (err) {
          res.status(400).send(JSON.stringify({success: false, message: 'Bad request. ids could be empty or maybe a mismatch between update and plant ids.'}))
        }
      }
      res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
    } else {
      res.status(400).send(JSON.stringify({success: false, message: 'Failed to delete plants. ids could be empty'}))
    }
  }
}