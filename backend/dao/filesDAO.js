
import csvtojson from "csvtojson"
import multer from "multer"
import path from "path"
//import files from "multer-gridfs-storage"
import GridFsStorage from 'multer-gridfs-storage'
import Grid from "gridfs-stream"
import methodOverride from "method-override";
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId


/*const files = require('multer-gridfs-storage')({
  db: connection.db,
  file: (req, file) => {
    return {
      filename: file.originalname
    }
  }
});*/


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

  

    static async uploadFiletoDB (filename) {
      try {
        const fileDoc = {
            file : filename
        }
        console.log(fileDoc)
        return await files.insertOne(fileDoc)
      } catch (e) {
        console.error(`Unable to post file: ${e}`)
        return { error: e }
      }
    }

    static async getFiles({
      filters = null,
      page = 0,
      filesPerPage = 20,
    } = {}) {
      let query
      if (filters) {
        if ("_id" in filters) {
          query = { "_id": { $eq: filters["_id"] } }
        } else if ("file" in filters) {
          query = { "file": { $eq: filters["file"] } }
      }
  
      let cursor
      
      try {
        cursor = await files
          .find(query)
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`)
        return { fileList: [], totalNumFilesList: 0 }
      }
  
      const displayCursor = cursor.limit(filesPerPage).skip(filesPerPage * page)
  
      try {
        const filesList = await displayCursor.toArray()
        const totalNumFiles = await files.countDocuments(query)
  
        return { filesList, totalNumFiles }
      } catch (e) {
        console.error(
          `Unable to convert cursor to array or problem counting documents, ${e}`,
        )
        return { filesList: [], totalNumFiles: 0 }
      }
    }
  }


    static async uploadCSVtoDB (data) {
    // CSV file name
      //const fileName = "sample.csv";
      var arrayToInsert = [];
      // Fetching the all data from each row
      for (var i = 0; i < data.length; i++) {
        var oneRow = {
          codeCourse: source[i]["קוד קורס"],
          semesterOfLearning: source[i]["סמס"],
          courseName: source[i]["שם קורס"],
          typeOfCourse: source[i]["סוג"],
          englishUnits: source[i]["שס"],
          units: source[i]["נזיכוי"],
          grade: source[i]["ציון"],
          studentID: ObjectId(studentID)
        };
        arrayToInsert.push(oneRow);
      }
      console.log("arrayToInsert : ")
      console.log(arrayToInsert)
      courses.insertMany(arrayToInsert, (err, result) => {
        if (err)
          console.log(err);
        if(result){
            console.log("Import CSV into database successfully.");
        }
       //inserting into the table "courses"    
    });
}

}
 