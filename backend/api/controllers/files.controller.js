import filesDAO from "../../dao/filesDAO.js"
import CoursesDAO from "../../dao/coursesDAO.js"
import fs from "fs"
import upload from "../../middleware/upload.js"
import mongodb from "mongodb"
import csv from "fast-csv"
const ObjectId = mongodb.ObjectId

export default class FilesController {


    static async apiNewTestPostFile(req, res) {
      try{
      //let file = req.file
        const fileRows = [];
        const fileTestRow = [];
        let studentID = req.params.id || {}

        const CourseResponse = await CoursesDAO.uploadCSVtoDB(
          req.file.path, 
          studentID
          )
        console.log("CourseResponse:")
        console.log(CourseResponse)
        //console.log("fs:")
        //fs.unlinkSync(req.file.path);
        /*fs.unlink(req.file.path, (err => {
          if (err) 
            console.log(err);
          else {
            console.log("\nDeleted file: "+req.file.path);
          }
        }));*/
        res.json({ status: "success" })
      } catch (e) {
        console.log("heybackend")
        console.log(`api, ${e}`)
        res.status(500).json({ error: e })
      }
      //fs.unlinkSync(req.file.path); 

    
    }
    
  

  

  static async apiGetFiles(req, res, next) {
    const filesPerPage = req.query.filesPerPage ? parseInt(req.query.filesPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    let filters = {}
    if (req.query._id) {
      filters._id = ObjectId(req.query._id)
    }else if (req.query.file) {
      filters.file = req.query.file
    }


    const { filesList, totalNumFiles } = await filesDAO.getFiles({
      filters,
      page,
      filesPerPage,
    })

    let response = {
      files: filesList,
      page: page,
      filters: filters,
      entries_per_page: filesPerPage,
      total_results: totalNumFiles,
    }
    res.json(response)
  }

}