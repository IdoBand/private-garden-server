import { Router, Request, Response } from 'express';
import { upload } from '../multerStorageConfig';
import { PlantUpdateDao } from '../dao/PlantUpdateDao';
// const updateDao = new PlantUpdateDao()

// const router = Router()
// router.post('/', upload.array('updateImages'), async (req: Request, res: Response) => {
//   const originalImageNames: string[] = []
//   const files = req.files as Express.Multer.File[];
//   for (let i = 0; i < files.length; i++) {
//   originalImageNames.push(files[i].originalname)
//   }
//   try {
//     const newUpdateId = await updateDao.add(JSON.parse(req.body.plantUpdate), originalImageNames)
//     res.status(200).send(JSON.stringify({success: true, message: 'Update added successfully!', data: newUpdateId}))
//   } catch (err) {
//     console.log( 'Failed to save Update.', err)
//     res.status(400).send(JSON.stringify({success: false, message: 'Failed to save Update.'}))
//   }
// })
// router.patch('/:id', upload.array('updateImages'), async (req: Request, res: Response) => {
//   const originalImageNames: string[] = []
//   const files = req.files as Express.Multer.File[];
//   for (let i = 0; i < files.length; i++) {
//     originalImageNames.push(files[i].originalname)
//   }
//   try {
//     const newUpdateId = await updateDao.edit(JSON.parse(req.body.plantUpdate), originalImageNames)
//     res.status(200).send(JSON.stringify({success: true, message: 'Update added successfully!', data: newUpdateId}))
//     } catch (err) {
//       console.log( 'Failed to save Update.', err)
//       res.status(400).send(JSON.stringify({success: false, message: 'Failed to save Update.'}))
//     }
// })
// router.get('/:id', async (req: Request, res: Response) => {
//   try {
//     const plantUpdates = await updateDao.getPlantUpdates(req.params.id)
//     const response = {
//       success: true,
//       message: '',
//       data: plantUpdates
//     }
//     res.status(200).send(JSON.stringify(response))
// } catch (err) {
//   res.status(400).send(JSON.stringify({success: false, message: 'Failed to get updates.'}))
// }
// })
// router.post('/delete', async (req: Request, res: Response) => {
//   const ids = req.body.ids
//   if (ids && ids.length > 0) {
//     try {
//       await updateDao.delete(ids)
//       res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
//     } catch (err) {
//       res.status(400).send(JSON.stringify({success: false, message: 'Failed to delete plants.'}))
//     }
//   } else {
//     res.status(400).send(JSON.stringify({success: false, message: 'Bad request ids could be empty.'}))
//   }
// })
  // export default router;

export class PlantUpdateController {
  updateDao: PlantUpdateDao
  router: Router
  constructor() {
    this.router = Router()
    this.updateDao = new PlantUpdateDao()
    this.setRoutes()
  }
  setRoutes() {
    this.router.post('/', upload.array('updateImages'), this.addPlantUpdate)
    this.router.patch('/:id', upload.array('updateImages'), this.editPlantUpdate)
    this.router.get(':/plantId', this.getPlantUpdates)
    this.router.post('/delete', this.deleteUpdate)
  }
  getRouter() {
    return this.router
  }
  addPlantUpdate = async (req: Request, res: Response) => {
    const originalImageNames: string[] = []
    const files = req.files as Express.Multer.File[];
    for (let i = 0; i < files.length; i++) {
    originalImageNames.push(files[i].originalname)
    }
    try {
      const newUpdateId = await this.updateDao.add(JSON.parse(req.body.plantUpdate), originalImageNames)
      res.status(200).send(JSON.stringify({success: true, message: 'Update added successfully!', data: newUpdateId}))
    } catch (err) {
      console.log( 'Failed to save Update.', err)
      res.status(400).send(JSON.stringify({success: false, message: 'Failed to save Update.'}))
    }
  }
  editPlantUpdate = async (req: Request, res: Response) => {
    const originalImageNames: string[] = []
    const files = req.files as Express.Multer.File[];
    for (let i = 0; i < files.length; i++) {
      originalImageNames.push(files[i].originalname)
    }
    try {
      const newUpdateId = await this.updateDao.edit(JSON.parse(req.body.plantUpdate), originalImageNames)
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
        await this.updateDao.delete(ids)
        res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
      } catch (err) {
        res.status(400).send(JSON.stringify({success: false, message: 'Failed to delete plants.'}))
      }
    } else {
      res.status(400).send(JSON.stringify({success: false, message: 'Bad request ids could be empty.'}))
    }
  }
}