import sharp from "sharp";
import { AbstractDao } from "./AbstractDao";

export class PlanetNetDao extends AbstractDao{
    readonly #basicURL: string
    #API_KEY: string
    constructor(){
        super()
        this.#basicURL = 'https://my-api.plantnet.org'
        this.#API_KEY = process.env.PLANET_NET_API_KEY || ''
    }
    async fetchIdentifyPlantPost(files: Express.Multer.File[]) {
        try {
            const formData = new FormData()
            const images = await Promise.all(files.map( async (file) => {
                const buffer = file.buffer
                const imageFile = await sharp(buffer).jpeg().toBuffer()
                const blob = new Blob([imageFile], { type: 'image/jpeg' })
                formData.append('images',blob )
                return blob
            }))
        const response = await fetch (
            `${this.#basicURL}/v2/identify/all?include-related-images=true&no-reject=false&lang=en&api-key=${this.#API_KEY}`, 
            {
                method: 'POST',
                body: formData
            })
        const res = await response.json()
        if (res.message) {
            throw Error (res.message)
        }
        return res
        } catch (err) {
            console.log('Something went wrong, ' + err)
            throw err
        }
    }
}