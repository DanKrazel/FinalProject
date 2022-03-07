import multer from "multer"
import path from "path"
//const {v4 : uuidv4} = require('uuid')
import {v4 as uuidv4} from "uuid"


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb){
        let ext = path.extname(file.originalname)
        cb(null, uuidv4() + '-' + Date.now() + ext)
    }
});
  
const upload = multer ({
    storage: storage,
})

export default upload;

