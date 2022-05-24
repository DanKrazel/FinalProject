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
    

   

    static async apiParsePDF(req, res) {
      try{
        var nameCourse = []
        let file = req.body.filePath
        console.log("file",file)
        const FileResponse = await FilesDAO.postDataPDF(file);
        let text = ""
        let column = {}
        for (let i=0; i<FileResponse.text.length; i++) {
          // if(FileResponse.text[i]!= '\n'){
          //   text += FileResponse.text[i]
          // }
          // if(FileResponse.text[i] == ')'){
          //   text += '\n';
          // }
          text += FileResponse.text[i]

        }
          FileResponse.text = text
          console.log(FileResponse.text)
          res.json({ FileResponse: FileResponse.text} )
        } catch (e) {
          console.log(`api, ${e}`)
          res.status(500).json({ error: e })
        }
    }
    
    

    // renderMatrix (matrix) {
    //   return (matrix || [])
    //   .map((row, y) => padColumns(row, nbCols).map(mergeCells).join(" | "))
    //   .join("\n");
    // }

    static async apiGetContentPDF(req, res, next) {
      let file = req.body.filePath
      var rows = {}; 
      var table = new PdfReader.TableParser()
      const nbCols = 2;
      const cellPadding = 40; // each cell is padded to fit 40 characters
      const columnQuantitizer = (item) => parseFloat(item.x) >= 20;

      // function printRows() {
      //   Object.keys(rows) // => array of y-positions (type: float)
      //     .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
      //     .forEach((y) => console.log((rows[y] || []).join('')));
      // }


      const padColumns = (array, nb) =>
        Array.apply(null, {length: nb}).map((val, i) => array[i] || []);
  // .. because map() skips undefined elements

      const mergeCells = (cells) => (cells || [])
        .map((cell) => cell.text).join('') // merge cells
        .substr(0, cellPadding).padEnd(cellPadding, ' '); // padding

      const renderMatrix = (matrix) => (matrix || [])
        .map((row, y) => padColumns(row, nbCols)
        .map(mergeCells)
        .join(' | ')
          ).join('\n');

          new PdfReader.parseFileItems(file, function(err, item){
            if (!item ) {
              // end of file, or page
              console.log(renderMatrix(table.getMatrix()));
              res.json({content:renderMatrix(table.getMatrix())})
            } else if (item.text) {
              // accumulate text items into rows object, per line
              table.processItem(item, columnQuantitizer(item));
            }
          });  
        // pdfBuffer contains the file content
      // new pdfreader.PdfReader().parseFileItems(file, function (err, item) {
      //     if (err) 
      //       console.error("error:", err);
      //     else if (!item){
      //       printRows();
      //       console.warn("end of buffer");
      //       //console.log(arrItems)
      //       res.json({content: rows})
      //     }
      //     else if (item.text){
      //       //console.log('1',item.text);
      //       //table.processItem(item, columnQuantitizer(item));
      //       //processItem(item)
      //       (rows[item.y] = rows[item.y] || []).push(item.text);
      //     }
      //     console.log(item)
      //   });
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