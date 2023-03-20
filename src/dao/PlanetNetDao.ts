import { AbstractDao } from "./AbstractDao";
import fs from 'fs'

export class PlanetNetDao extends AbstractDao{
    readonly basicURL: string
    #API_KEY: string
    constructor(){
        super()
        this.basicURL = 'my-api.plantnet.org'
        this.#API_KEY = '2b104d0VgwbnHr9rmWZYm6Bu'
    }
    async fetchIdentifyPlantPost(imageName: string) {
        const formData = new FormData()

        const imageFile = fs.readFileSync(`${process.cwd()}/images/` + imageName)
        const blob = new Blob([imageFile], { type: 'image/jpeg' })
        formData.append('images',blob)

        const response = await fetch (`https://my-api.plantnet.org/v2/identify/all?include-related-images=true&no-reject=false&lang=en&api-key=2b104d0VgwbnHr9rmWZYm6Bu`, 
  {method: 'POST',
            body: formData})
        
        const res = await response.json()
        console.log('this issssss',res);
        return res
        
    }
}