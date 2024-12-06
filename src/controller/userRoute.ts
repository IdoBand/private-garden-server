import { Router, Request, Response } from 'express';
import { UserDao } from '../dao/UserDao';
import { upload } from '../multerStorageConfig';

const userDao = new UserDao()
const router = Router()

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

export default router