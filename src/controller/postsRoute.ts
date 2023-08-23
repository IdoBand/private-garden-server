import { Router, Request, Response } from 'express';
import { upload } from '../multerStorageConfig';
import { PostDao } from '../dao/PostDao';
import { UserDao } from '../dao/UserDao';

const postDao = new PostDao()
const userDao = new UserDao()
const router = Router()


router.get('/',  async (req: Request, res: Response) => {
  try {
    const rawPosts = await postDao.getAllPosts()
    const posts = await Promise.all(
      rawPosts.map(async (post) => {
        const { userName, profileImg } = await userDao.getUserDataForPost(post.userId)
        return {
          // @ts-ignore
          ...post._doc,
          userName,
          profileImg
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
    res.status(500).send(JSON.stringify({message: 'Failed to get posts.'}))
  }
})

router.post('/', upload.array('postImages'), async (req: Request, res: Response) => {

  const originalImageNames: string[] = []
  const files = req.files as Express.Multer.File[];
  for (let i = 0; i < files.length; i++) {
    originalImageNames.push(files[i].originalname)
  }

  try {
    const postId = await postDao.add(JSON.parse(req.body.post), originalImageNames)
    const response = {
      success: true,
      message: '',
      data: postId
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'Failed to add post.'}))
  }
})
router.post('/like', async (req: Request, res: Response) => {
  try {
    const response = {
      success: true,
      message: '',
      data: null
    }
    if (req.body.like) {
      const result = await postDao.likePost(req.body.postId, req.body.userId)
      response.data = result
    } else {
      const result = await postDao.dislikePost(req.body.postId, req.body.userId)
      response.data = result
    }
    res.status(200).send(JSON.stringify({response}))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'Failed to complete like / dislike action.'}))
  }
})
router.post('/addDummy', upload.array('postImages'), async (req: Request, res: Response) => {

  const originalImageNames: string[] = []
  const files = req.files as Express.Multer.File[];
  for (let i = 0; i < files.length; i++) {
    originalImageNames.push(files[i].originalname)
  }

  try {
    const postId = await postDao.add(JSON.parse(req.body.post), originalImageNames)
    const response = {
      success: true,
      message: '',
      data: postId
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'Failed to add post.'}))
  }
})

router.get('/delete/:id', async (req: Request, res: Response) => {
  const postId = req.params.id
  try {
    const result = await postDao.delete(postId)
    const response = {
      success: true,
      message: '',
      data: result
    }
    res.status(200).send(JSON.stringify(response))
  } catch (err) {
    res.status(500).send(JSON.stringify({message: 'Failed to delete post.'}))
  }
})

export default router