import multer from "multer";

const fileStorageEngine = multer.memoryStorage()


// older configuration to store buffers in disk storage
// not in use at the moment

// const fileStorageEngine = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, `${process.cwd()}/images`)},
//       filename: (req, file, cb) => {
//         cb(null, file.originalname)
//       }
//     })
export const upload = multer({ storage: fileStorageEngine })