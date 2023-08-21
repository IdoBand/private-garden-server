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
            // userId, text, dateAdded are coming from frontend
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
}