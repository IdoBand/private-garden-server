import { AbstractDao } from "./AbstractDao";
import { PostModel } from "../models";
import { Post } from '../types'
export class PostDao extends AbstractDao {
    model: typeof PostModel
    constructor() {
        super()
        this.model = PostModel
    }

    async add(newPost: Partial<Post>, imageNamesArray: string[]) {
        try {
            const images = this.deicideMultipleImages(imageNamesArray)
            // properties userId, text, dateAdded are coming from frontend
            const savePost = new PostModel({
                ...newPost,
                images,
                likes: [],
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
    async dislikePost(postId: string, userId: string) {
        try {
            const result = this.model.updateOne(
                { _id: postId },
                {$pull: { likes: userId }}
            )
            return result
        } catch (err) {
            console.log('Failed to dislike post.' + err)
            throw err
        }
    }
    async likePost(postId: string, userId: string) {
        try {
            const result = this.model.updateOne(
                { _id: postId },
                { $push: { likes: userId }},
            )
            return result
        } catch (err) {
            console.log('Failed to like post.' + err)
            throw err
        }
    }
}