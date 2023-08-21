import { Router, Request, Response } from 'express';
import { upload } from '../multerStorageConfig';
import { PostDao } from '../dao/PostDao';

const postDao = new PostDao()
const router = Router()


router.get('/',  async (req: Request, res: Response) => {
  try {
    const result = await postDao.getAllPosts()
    const response = {
      success: true,
      message: '',
      data: result
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

export default router