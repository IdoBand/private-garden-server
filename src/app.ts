import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToMongo } from './mongo/mongooseConnection'
import {PlantDao} from './dao/PlantDao'
import { PlantUpdateDao } from './dao/PlantUpdateDao'
import { upload } from './multerStorageConfig';
import bodyParser from 'body-parser';
import { PlanetNetDao } from './dao/PlanetNetDao';

const app = express();

let updateDao: PlantUpdateDao
let plantDao: PlantDao
let planetNetDao: PlanetNetDao
export async function initiateApp() {
  await connectToMongo()
  plantDao = new PlantDao()
  updateDao = new PlantUpdateDao()
  planetNetDao = new PlanetNetDao() 
}

app.use(cors());
app.use(bodyParser.json())
/////////////
app.get('test', (req: Request, res: Response) => {
  res.send('hi')})

///////////////////       U P D A T E    D A O        ///////////////////
app.post('/addPlantUpdate', upload.single('updateImage'), async (req: Request, res: Response) => {
  let responseObject = {
    message: '',
    code: 200,
    newUpdateId: ''
  }

  let imageOriginalName = '';
  if (req.file) {
    imageOriginalName = req.file.originalname
  }
  try {
    const newUpdateId = await updateDao.addUpdate(
      req.body.date,
      req.body.plantId,
      req.body.plantName,
      imageOriginalName,
      req.body.irrigationBoolean,
      req.body.waterQuantity,
      req.body.fertilizer,
      req.body.fertilizerQuantity,
      req.body.notes,
      );
      responseObject.newUpdateId = newUpdateId;
      responseObject.message = 'Update was saved successfully!';
    } catch (err) {
        responseObject.code = 400
        responseObject.message = 'Failed to save Update.'
        console.log(responseObject.message, err)
    }
    res.status(responseObject.code).send(JSON.stringify(responseObject))
})

app.get('/getAllUpdatesByPlantId', async (req: Request, res: Response) => {
  try {
    const updates = await updateDao.getAllUpdatesByPlantId(req.query.id as string)
    res.status(200).json(updates)
} catch (err) {
  res.status(400).send('Failed to get updates.')
}
})

///////////////////       P L A N T    D A O        ///////////////////
app.post('/addPlant', upload.single('plantImage'), async (req: Request, res: Response) => {
  let imageOriginalName = '';
  if (req.file) {
    imageOriginalName = req.file.originalname
  }
  try {
    await plantDao.addPlant(req.body.plantName, imageOriginalName)
    res.status(200).send(JSON.stringify({message: 'Plant was saved successfully!'}))
  } catch (err){
    res.status(400).send(JSON.stringify({message: 'Failed to save plant.'}))
  }
})

app.get('/getEntireGarden', async (req: Request, res: Response) => {
  try {
    const entireGarden = await plantDao.getEntireGarden()
    res.status(200).json(entireGarden)
} catch (err) {
  res.status(400).send(JSON.stringify({message: 'Failed to get entire garden.'}))
}
})

app.post('/removePlants', async (req: Request, res: Response) => {
  try {
    await plantDao.removePlants(req.body.IdsToRemove)
    res.status(200).send(JSON.stringify({message: 'Plants were removed successfully!'}))
} catch (err) {
    res.status(400).send(JSON.stringify({message: 'Failed to remove plant.'}))
}
})
/////////   N O T    F I N I S H E D
app.post('/editPlantById', upload.single('plantImage'), async (req: Request, res: Response) => {
  let imageOriginalName = '';
  if (req.file) {
    console.log(req.file);
    
    imageOriginalName = req.file.originalname
  }
  
  
  const plantId = req.body.plantId
  const newInfo = {plantName: req.body.plantName,
                  img: imageOriginalName}
                    console.log(plantId, newInfo);
                    
  try {
      await plantDao.editPlant(plantId, newInfo)
      res.status(200).send(JSON.stringify({message: 'Plant was updated successfully!'}))
  } catch (err) {
    res.status(400).send(JSON.stringify({message: 'Failed to edit plant.'}))
}
})


///////////////////        P l @ n t    N e t        ///////////////////

app.post('/IdentifyPlant', upload.array('plantImages'), async (req: Request, res: Response) => {
    let originalImageNames: string[] = []
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      for (let i = 0; i < files.length; i++) {
      originalImageNames.push(files[i].originalname)
      }

    try {
      const responseObject = await planetNetDao.fetchIdentifyPlantPost(originalImageNames)
      res.send(JSON.stringify({message: responseObject.bestMatch}))
    } catch (err) {
        const errorMessage = 'Failed to identify'
        console.log(errorMessage + err);
        res.send(JSON.stringify({message: errorMessage}))
    }
    }
    
  })
export default app;