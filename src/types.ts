export interface PlantEdit {
    plantName: string,
    img: string | { data: Buffer | []; contentType: string }
}
export interface PlantUpdate {
    plantId: string
    plantName: string
    dateAdded: string
    img: string | { data: Buffer | []; contentType: string }
    irrigation: Irrigation
    notes: string
}
export interface Irrigation {
    boolean: boolean
    waterQuantity?: number
    fertilizer?: string
    fertilizerQuantity?: number
}