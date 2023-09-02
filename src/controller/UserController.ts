import { AbstractController } from './AbstractController';
import { Router, Request, Response } from 'express';
import { UserDao } from '../dao/UserDao';
import { upload } from '../multerStorageConfig';

export class UserController extends AbstractController {
  userDao: UserDao
  router: Router

  constructor() {
    super()
    this.router = Router()
    this.userDao = new UserDao()
    this.setRoutes()
  }
  setRoutes() {
    this.router.post('/test', upload.single('profileImg'), this.getTest);
    this.router.post('/', upload.single('profileImg'), this.handleSignIn);
  }
  getRouter() {
    return this.router
  }
  getTest = async (req: Request, res: Response) => {
    const fileData = this.decideFileData(req.file)
    try {
      const result = await this.userDao.test(fileData)
      const response = {
        success: true,
        message: '',
        data: result
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      res.status(500).send(JSON.stringify({message: 'test failed'}))
    }
  }
  handleSignIn = async (req: Request, res: Response) => {
    const fileData = this.decideFileData(req.file)
    try {
      const user = await this.userDao.handleSignIn(JSON.parse(req.body.user), fileData)
      const response = {
        success: true,
        message: '',
        data: user
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      res.status(500).send(JSON.stringify({message: 'Failed to upsert user.'}))
    }
  }
}