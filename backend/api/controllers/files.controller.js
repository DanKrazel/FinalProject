import FilesDAO from "../../dao/filesDAO.js"
import CoursesDAO from "../../dao/coursesDAO.js"
import fs from "fs"
import upload from "../../middleware/upload.js"
import mongodb from "mongodb"
import csv from "fast-csv"
import pdfParse from "pdf-parse"
import {PdfReader} from "pdfreader"


const ObjectId = mongodb.ObjectId

export default class FilesController {


    static async apiNewTestPostFile(req, res) {
      try{
        let studentID = req.params.id || {}

        const CourseResponse = await CoursesDAO.uploadCSVtoDB(
          req.file.path, 
          studentID
          )
        console.log("CourseResponse:")
        console.log(CourseResponse)
        res.json({ status: "success" })
      } catch (e) {
        console.log("heybackend")
        console.log(`api, ${e}`)
        res.status(500).json({ error: e })
      }
    }
    

   

    static async apiPostPDF(req, res) {
      try{
        let file = req.body.filePath
        console.log("file",file)
          // let file = req.file.path
          // console.log("FileResponse:")
          // console.log(file)
          // // res.json({ status: "success",
          // //            FileResponse: FileResponse })
          // res.status(200).send({ status: "success",
          //                        file: file
          //              });
          
          // const FileResponse = await FilesDAO.getItemsPDF(
          //   file, 
          //   )
          // if (!file) {
          //   res.status(400);
          //   res.end();
          // }
    
  

          const FileResponse = await FilesDAO.postDataPDF(file);
          let text = ""
          for (let i=0; i<FileResponse.text.length; i++) {
              if(FileResponse.text[i]!= '\n'){
                  text += FileResponse.text[i]
              }
              else if(FileResponse.text[i] == '(A)' || FileResponse.text[i] == '(B)' || FileResponse.text[i] == '(C)' || FileResponse.text[i] == '(D)'
              || FileResponse.text[i] == '(E)' || FileResponse.text[i] == '(F)')
                text += '\n'
          }
          // new PdfReader().parseFileItems(file, (err, item) => {
          //   if (err) console.error("error:", err);
          //   else if (!item) 
          //     console.warn("end of file");
          //   else if (item.text) 
          //     //console.log(item.text);
          //     var item = item.text
          // });
          FileResponse.text = text
          res.json({ FileResponse: FileResponse} )

          //console.log("FileResponse:", FileResponse)
          //res.json({ file: file})
        } catch (e) {
          console.log("heybackend")
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
        }
    }
    
    static async apiGetContentPDF(req, res, next) {
      let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: false
    }
      let file = req.body.filePath
      console.log("file",file)
      const doc = await pdfjsLib.getDocument(file).promise // note the use of the property promise
      const page = await doc.getPage(1)
      const content = await page.getTextContent(render_options)
      res.json({content: content})
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