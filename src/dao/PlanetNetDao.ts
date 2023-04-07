import { AbstractDao } from "./AbstractDao";
import fs from 'fs'

export class PlanetNetDao extends AbstractDao{
    readonly basicURL: string
    #API_KEY: string
    constructor(){
        super()
        this.basicURL = 'https://my-api.plantnet.org'
        this.#API_KEY = '2b104d0VgwbnHr9rmWZYm6Bu'
    }
    async fetchIdentifyPlantPost(originalImageNames: string[]) {
        try {
            const formData = new FormData()
        for (let i = 0 ; i < originalImageNames.length ; i++) {
            const imageFile = fs.readFileSync(`${process.cwd()}/images/` + originalImageNames[i])
            const blob = new Blob([imageFile], { type: 'image/jpeg' })
            formData.append('images', blob)
        }
        const response = await fetch (`${this.basicURL}/v2/identify/all?include-related-images=true&no-reject=false&lang=en&api-key=${this.#API_KEY}`, 
            {method: 'POST',
            body: formData})
        
        const res = await response.json()
        return res
        } catch (err) {
            console.log('Something went wrong, ' + err)
            throw err
        }
        
    }
}