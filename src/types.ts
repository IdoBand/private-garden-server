export interface PlantEdit {
    plantName?: string,
    img?: string | { data: Buffer | []; contentType: string }
}
export interface PlantUpdate {
    _id?: string
    userId?: string
    plantId?: string
    plantName?: string
    dateAdded?: string
    img?: string | { data: Buffer | []; contentType: string }
    irrigation?: Irrigation
    notes?: string
}
export interface Irrigation {
    boolean?: boolean
    waterQuantity?: number
    fertilizer?: string
    fertilizerQuantity?: number
}

///////////////////////////
export interface Plant {
    _id?: string
    userId: string
    plantName: string
    dateAdded: Date
    img?: { data: Buffer | []; contentType: string }
}
export interface User {
    id: string // email
    firsName: string
    lastName: string
    dateAdded: Date
    lastLogin: Date
}
export interface responseObject {
    success: boolean
    message: string
    data?: any
}