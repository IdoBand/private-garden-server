import { AbstractController } from "./AbstractController";
import { Router, Request, Response } from 'express';
import { PlanetNetDao } from "../dao/PlanetNetDao";
import { upload } from '../multerStorageConfig';
export class PlanetNetController extends AbstractController {
    router: Router
    #planetNetDao: PlanetNetDao
    constructor() {
        super()
        this.router = Router()
        this.#planetNetDao = new PlanetNetDao()
        this.setRoutes()
    }
    getRouter() {
        return this.router
    }
    private setRoutes() {
        this.router.post('/identify', upload.array('plantImages'), this.Identify);
    }
    Identify = async (req: Request, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[]
            if (!files) {
                res.status(400).send(JSON.stringify({success: false, message: 'No images in request'}))
            }
            const responseObject = await this.#planetNetDao.fetchIdentifyPlantPost(files)
            res.status(200).send(JSON.stringify({success: true, message: 'Identify request successful', data: responseObject.bestMatch}))
        } catch (err) {
            const errorMessage = 'Failed to identify'
            console.log(errorMessage + err);
            res.status(500).send(JSON.stringify({success: false, message: errorMessage}))
        }
    }
}