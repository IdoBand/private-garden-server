import axios from "axios";
import { AbstractDao } from "./AbstractDao";

export class PlanetNetDao extends AbstractDao{
    readonly basicURL: string
    #API_KEY: string
    constructor(){
        super()
        this.basicURL = 'https://my-api.plantnet.org'
        this.#API_KEY = process.env.PLANET_NET_API_KEY
    }
    async fetchIdentifyPlantPost(originalImageNames: string[]) {
        try {
            const formData = new FormData()
        for (let i = 0 ; i < originalImageNames.length ; i++) {
            const imageFile = this.fsReadFileSync(originalImageNames[i])
            const blob = new Blob([imageFile], { type: 'image/jpeg' })
            formData.append('images', blob)
            this.removeImageFromStorage(originalImageNames[i])
        }
        // const response = await fetch (`${this.basicURL}/v2/identify/all?include-related-images=true&no-reject=false&lang=en&api-key=${this.#API_KEY}`, 
        //     {method: 'POST',
        //     body: formData})
        const response = await axios.post(`${this.basicURL}/v2/identify/all?include-related-images=true&no-reject=false&lang=en&api-key=${this.#API_KEY}`, formData)
        return response.data
        } catch (err) {
            console.log('Something went wrong, ' + err)
            throw err
        }
        
    }
}