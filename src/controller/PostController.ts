import { Router, Request, Response } from 'express';
import { upload } from '../multerStorageConfig';
import { PostDao } from '../dao/PostDao';
import { UserDao } from '../dao/UserDao';
import { AbstractController } from './AbstractController';

export class PostController extends AbstractController{
  postDao: PostDao
  userDao: UserDao
  router: Router
  constructor() {
    super()
    this.router = Router()
    this.postDao = new PostDao()
    this.userDao = new UserDao()
    this.setRoutes()
  }
  setRoutes() {
    this.router.get('/:userId', this.getAllPosts)
    this.router.post('/', upload.array('postImages'), this.addPost)
    this.router.post('/like', this.like)
    this.router.get('/delete/:id', this.deletePost)
  }
  getRouter() {
    return this.router
  }
  getAllPosts = async (req: Request, res: Response) => {
    const userId = req.params.userId
    try {
      const rawPosts = await this.postDao.getAllPosts()
      const posts = await Promise.all(
        rawPosts.map(async (post) => {
          // @ts-ignore
          const postId = post._doc._id
          const { userName, profileImg } = await this.userDao.getUserDataForPost(post.userId)
          const likes = await this.postDao.countLikes(postId)
          const didUserLike = await this.postDao.didUserLike(userId, postId)

          return {
            // @ts-ignore
            ...post._doc,
            userName,
            profileImg,
            likes,
            didUserLike,
          }
        })
      )
      const response = {
        success: true,
        message: '',
        data: posts
      }

      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      console.log(err);
      
      res.status(500).send(JSON.stringify({message: 'Failed to get posts.'}))
    }
  }
  addPost = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const filesData = this.decideMultipleFilesData(files)

    try {
      const postId = await this.postDao.add(JSON.parse(req.body.post), filesData)
      const response = {
        success: true,
        message: '',
        data: postId
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      res.status(500).send(JSON.stringify({message: 'Failed to add post.'}))
    }
  }
  like = async (req: Request, res: Response) => {
    const response = {
      success: true,
      message: '',
      data: null
    }
    try {
      if (req.body.like) {
        const result = await this.postDao.likePost(req.body)
        response.data = result
      } else {
        const result = await this.postDao.dislikePost(req.body.userId, req.body.postId)
        response.data = result
      }
      res.status(200).send(JSON.stringify({response}))
    } catch (err) {
      res.status(500).send(JSON.stringify({message: 'Failed to complete like / dislike action.'}))
    }
  }

  deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id
    try {
      const result = await this.postDao.delete(postId)
      const response = {
        success: true,
        message: '',
        data: result
      }
      res.status(200).send(JSON.stringify(response))
    } catch (err) {
      res.status(500).send(JSON.stringify({message: 'Failed to delete post.'}))
    }
  }
}