import { Router, Request, Response } from 'express';
import { PlantDao } from '../dao/PlantDao';
import { upload } from '../multerStorageConfig';
import { Plant } from '../types';
const plantDao = new PlantDao
const router = Router()
router.get('/:userId', async (req: Request, res: Response) => {
    try {
      const garden = await plantDao.getGarden(req.params.userId)
      const response = {
        success: true,
        message: '',
        data: garden
      }
      res.status(200).send(JSON.stringify(response))
  } catch (err) {
      res.status(400).send(JSON.stringify({message: 'Failed to get entire garden.'}))
  }
  })
router.post('/', upload.single('plantImage'), async (req: Request, res: Response) => {
  let imageOriginalName = '';
  if (req.file) {
    imageOriginalName = req.file.originalname
  }
  const newPlant: Plant = {
    userId: req.body.userId,
    plantName: req.body.plantName,
    dateAdded: new Date(req.body.dateAdded as string)
  }
  try {
    const result = await plantDao.add(newPlant, imageOriginalName)
    const response = {
      success: true,
      message: 'Plant was saved successfully!',
      data: result._id
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err){
    res.status(400).send(JSON.stringify({message: 'Failed to save plant.'}))
  }
})
router.patch('/:id', upload.single('plantImage'), async (req: Request, res: Response) => {
  let imageOriginalName = '';
  if (req.file) {
    imageOriginalName = req.file.originalname
  }
  try {
    await plantDao.edit(req.body, imageOriginalName)
    const response = {
      success: true,
      message: 'Plant was edited successfully!'
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err){
    res.status(400).send(JSON.stringify({message: 'Failed to save plant.', success: false}))
  }
})
router.post('/delete', async (req: Request, res: Response) => {
  const ids = req.body.ids
  if (ids && ids.length > 0) {
    try {
      await plantDao.delete(ids)
      res.status(200).send(JSON.stringify({success: true, message: 'Delete query successful'}))
    } catch (err) {
      res.status(400).send(JSON.stringify({success: false, message: 'Failed to delete plants.'}))
    }
  } else {
    res.status(400).send(JSON.stringify({success: false, message: 'Bad request ids could be empty.'}))
  }
})
  export default router;