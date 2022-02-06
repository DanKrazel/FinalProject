import mongodb from "mongodb"
import csvtojson from "csvtojson"
import multer from "multer"
import utils from "utils"
import crypto from 'crypto';
import multer from 'multer';
import GridFsStorage from 'multer-gridfs-storage'
import Grid from "gridfs-stream"
import methodOverride from "method-override";


let files

export default class filesDAO {
  static async injectDB(conn) {
    if (files) {
      return
    }
    try {
        files = await conn.db(process.env.RESTREVIEWS_NS).collection("files")
    } catch (e) {
      console.error(`Unable to establish collection handles in fileDAO: ${e}`)
    }
  }

  

  static async addFile (file) {
    try {
      const fileDoc = {
        file : file
      }
      courses.insertOne(fileDoc)
  } catch (e) {
    console.log(`api, ${e}`)
    res.status(500).json({ error: e })
  }
  }

  conn.once('open', () => {
    // Init stream
    files = Grid(conn.db, mongoose.mongo);
  });

// Create storage engine
  static async postFile() {
    const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'files'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  }
const upload = multer({ storage });


 
}