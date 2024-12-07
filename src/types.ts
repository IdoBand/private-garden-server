export interface PlantUpdate {
    _id?: string
    userId?: string
    plantId?: string
    dateAdded?: string
    images?: string[]
    irrigation?: Irrigation
    notes?: string
}
export interface Irrigation {
    boolean?: boolean
    waterQuantity?: number
    fertilizer?: string
    fertilizerQuantity?: number
}
export interface Plant {
    _id?: string
    userId: string
    plantName: string
    dateAdded: Date
    img: string
}
export interface User {
    id: string
    firstName: string
    lastName: string
    dateAdded?: Date
    lastActive?: Date
    profileImg?: string
    followers?: string[],
    following?: string[]
}
export interface responseObject {
    success: boolean
    message: string
    data?: any
}
export type Post = {
    _id?: string,
    userId: string,
    images: string[]
    dateAdded: Date
    text: string
    likes: number
    comments: Comment[]
    userName?: string
    profileImg?: string
    didUserLike?: boolean
}
export type Like = {
    userId: string
    postId: string
    dateAdded: Date
}
export type Comment = {
    userId: string
    text: string
    dateAdded: Date
}
export type FileData = {
    buffer: Buffer | undefined
    mimetype: string
}