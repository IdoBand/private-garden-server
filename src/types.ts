export interface PlantEdit {
    plantName?: string,
    img?: string | { data: Buffer | []; contentType: string }
}
export interface PlantUpdate {
    _id?: string
    userId?: string
    plantId?: string
    dateAdded?: string
    images?: string[] | { data: Buffer | []; contentType: string }[]
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
    img?: { data: Buffer | []; contentType: string }
}
export interface User {
    id: string
    firstName: string
    lastName: string
    dateAdded?: Date
    lastActive?: Date
    profileImg?: string | { data: Buffer | []; contentType: string }
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
    images: string[] | { data: Buffer | []; contentType: string }[]
    dateAdded: Date
    text: string
    likes: number
    comments: Comment[]
    userName?: string
    profileImg?: { data: Buffer | []; contentType: string }
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