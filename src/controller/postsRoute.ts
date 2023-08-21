import { Router, Request, Response } from 'express';
import { upload } from '../multerStorageConfig';
import { PostDao } from '../dao/PostDao';
import { UserDao } from '../dao/UserDao';
import { Post } from 'src/types';

const postDao = new PostDao()
const userDao = new UserDao()
const router = Router()


router.get('/',  async (req: Request, res: Response) => {
  try {
    const rawPosts = await postDao.getAllPosts()
    const posts = await Promise.all(
      rawPosts.map(async (post) => {
        const { userName, profileImg } = await userDao.getUserDataForPost(post.userId)
        console.log(userName);
        
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

export default router