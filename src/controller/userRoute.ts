import { Router, Request, Response } from 'express';
import { UserDao } from '../dao/UserDao';
import { upload } from '../multerStorageConfig';

const userDao = new UserDao()
const router = Router()

router.get('/test', async (req: Request, res: Response) => {
  try {
    const user = await userDao.getUserDataForPost('jonathan.walters@dummy.com')
    const response = {
      success: true,
      message: '',
      data: user
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'test failed'}))
  }
})

router.post('/', upload.single('profileImg'), async (req: Request, res: Response) => {
  let imageOriginalName = '';
  if (req.file) {
    imageOriginalName = req.file.originalname
  }
  try {
    const user = await userDao.handleSignIn(JSON.parse(req.body.user), imageOriginalName)
    const response = {
      success: true,
      message: '',
      data: user
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'Failed to upsert user.'}))
  }
})


router.post('/addDummy', upload.single('userImg'), async (req: Request, res: Response) => {
  let imageOriginalName = '';
  if (req.file) {
    imageOriginalName = req.file.originalname
  }

  const userData = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }

  try {
    const user = await userDao.addDummyUser(userData, imageOriginalName)
    const response = {
      success: true,
      message: '',
      data: user
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'Failed to upsert user.'}))
  }
})

export default router