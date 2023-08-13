import { Router, Request, Response } from 'express';
import { UserDao } from '../dao/UserDao';

const userDao = new UserDao()
const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await userDao.handleSignIn(req.body.user)
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