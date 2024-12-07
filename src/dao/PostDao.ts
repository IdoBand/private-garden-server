import { AbstractDao } from "./AbstractDao";
import { PostModel, LikeModel } from "../models";
import { FileData, Like, Post } from '../types'

export class PostDao extends AbstractDao {
    #model: typeof PostModel
    #likesModel: typeof LikeModel
    #s3FolderName: string
    constructor() {
        super()
        this.#model = PostModel
        this.#likesModel = LikeModel
        this.#s3FolderName = 'postImg'
    }

    async add(newPost: Partial<Post>, filesData: FileData[]) {
        try {
            const images = await this.decideMultipleImageFiles(filesData, this.#s3FolderName)
            // properties userId, text, dateAdded are coming from frontend
            const savePost = new PostModel({
                ...newPost,
                images,
                comments: [],
            })
            const response = await savePost.save()
            return response._id
        } catch (err) {
            console.log('Failed to add post.' + err)
            throw err
        }
    }
    async getAllPosts() {
        try {
            const posts = await this.#model.find()
            const postsWithImages = await Promise.all(posts.map( async (post) => {
                const postImages = await this.s3.readMultiple(post.images, this.#s3FolderName)
                post.images = postImages
                return post
            }))
            return postsWithImages
        } catch (err) {
            console.log('Failed to get all posts.' + err)
            throw err
        }
    }
    async delete(postId: string) {
        try {
            const post = await this.#model.findById(postId)
            if (post.images.length > 0) {
                const deleteFromS3Bucket = await this.s3.deleteMultiple(post.images, this.#s3FolderName)
            }
            const likesDeletion = await this.deleteAllLikesForPost(postId)
            const deletePost = await this.#model.findByIdAndDelete(postId)
            return deletePost
        } catch (err) {
            console.log('Failed to get all posts.' + err)
            throw err
        }
    }
    async dislikePost(userId: string, postId: string) {
        try {
            const result = await this.#likesModel.findOneAndDelete({userId: userId, postId: postId})
            return result
        } catch (err) {
            console.log('Failed to dislike post.' + err)
            throw err
        }
    }
    async likePost(likeData: Like) {
        try {
            const saveLike = new LikeModel({
                userId: likeData.userId,
                postId: likeData.postId,
                dateAdded: new Date()
            })
            const result = await saveLike.save()
            return result
        } catch (err) {
            console.log('Failed to like post.' + err)
            throw err
        }
    }
    async countLikes(postId: string) {
        try {
            const result = await this.#likesModel.countDocuments({ postId })
            return result
        } catch (err) {
            console.log(`Failed to count how many likes for ${postId}.` + err)
            throw err
        }
    }
    async didUserLike(userId: string, postId: string): Promise<boolean> {
        try {
            const result = await this.#likesModel.countDocuments({ postId, userId })
            if (result) {
                return true
            }
            return false
        } catch (err) {
            console.log(`Failed to query did user like for ${postId}.` + err)
            throw err
        }
    }
    async deleteAllLikesForPost(postId: string) {
        try {
            const result = await this.#likesModel.deleteMany({ postId })
            return result
        } catch (err) {
            console.log(`Failed to delete all likes for ${postId}.` + err)
            throw err
        }
    }
    async editPost(post: Partial<Post>, filesData: FileData[]) {
        try {
            const exitingPost = await this.#model.findById(post._id)
            if (exitingPost.images.length > 0) {
                const deleteFromS3Bucket = await this.s3.deleteMultiple(exitingPost.images, this.#s3FolderName)
            }
            const imageNames = await this.s3.putMultiple(filesData, this.#s3FolderName)
            post.images = imageNames
            const response = await this.#model.findByIdAndUpdate(post._id, post)
            return response
        } catch (err) {
            console.log(`Failed to edit post ${post._id}` + err)
            throw err
        }
    }
}