import { AbstractDao } from "./AbstractDao";
import { PostModel, LikeModel } from "../models";
import { Like, Post } from '../types'
export class PostDao extends AbstractDao {
    model: typeof PostModel
    likesModel: typeof LikeModel
    constructor() {
        super()
        this.model = PostModel
        this.likesModel = LikeModel
    }

    async add(newPost: Partial<Post>, imageNamesArray: string[]) {
        try {
            const images = this.deicideMultipleImages(imageNamesArray)
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
            const result = this.model.find()
            return result
        } catch (err) {
            console.log('Failed to get all posts.' + err)
            throw err
        }
    }
    async delete(postId: string) {
        try {
            const result = this.model.findOneAndDelete({_id: postId})
            return result
        } catch (err) {
            console.log('Failed to get all posts.' + err)
            throw err
        }
    }
    async dislikePost(userId: string, postId: string) {
        try {
            const result = await this.likesModel.findOneAndDelete({userId: userId, postId: postId})
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
            const result = await this.likesModel.countDocuments({ postId })
            return result
        } catch (err) {
            console.log(`Failed to count how many likes for ${postId}.` + err)
            throw err
        }
    }
    async didUserLike(userId: string, postId: string): Promise<boolean> {
        try {
            const result = await this.likesModel.countDocuments({ postId, userId })
            if (result) {
                return true
            }
            return false
        } catch (err) {
            console.log(`Failed to query did user like for ${postId}.` + err)
            throw err
        }
    }
}