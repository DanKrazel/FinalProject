import mongodb from "mongodb"
import csvtojson from "csvtojson"
import multer from "multer"
import fs from "fs"
import XLSX from "xlsx"


import StudentsDAO from "./studentsDAO.js"
const ObjectId = mongodb.ObjectId
import unitsBySemesterDAO from "./unitsBySemesterDAO.js"

let coursesDetails

export default class CoursesDAO {
  static async injectDB(conn) {
    if (coursesDetails) {
      return
    }
    try {
        coursesDetails = await conn.db(process.env.STUDREVIEWS_NS).collection("coursesDetails")
    } catch (e) {
      console.error(`Unable to establish collection handles in coursesDetailsDAO: ${e}`)
    }
  }

  static async addCourseDetails(codeCourse, courseName, semesterOfLearning, yearOfLearning ,englishUnits, units, typeOfCourse) {
    try {
      const courseDoc = {
          codeCourse : codeCourse,
          courseName : courseName,
          yearOfLearning: yearOfLearning,
          semesterOfLearning: semesterOfLearning,
          typeOfCourse: typeOfCourse,
          englishUnits : englishUnits,
          units: units,}
          
      return await coursesDetails.insertOne(courseDoc)
    } catch (e) {
      console.error(`Unable to post course: ${e}`)
      return { error: e }
    }
  }

  static async updateCourse(courseID, text, date) {
    try {
      const updateResponse = await coursesDetails.updateOne(
        { _id: ObjectId(courseID)},
        { $set: { text: text, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update course: ${e}`)
      return { error: e }
    }
  }

  static async deleteCourse(courseID) {
    try {
      const deleteResponse = await coursesDetails.deleteOne({
        _id: ObjectId(courseID),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete course: ${e}`)
      return { error: e }
    }
  }


  static async deleteAllCoursesDetails() {
    try {
      const deleteResponse = await coursesDetails.deleteMany({
      })
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete course: ${e}`)
      return { error: e }
    }
  }


  static async getCoursesDetails({
    filters = null,
  } = {}) {
    let query
    if (filters) {
      if ("_id" in filters) {
        query = { "_id": { $eq: filters["_id"] } }
      } else if ("codeCourse" in filters) {
        query = { "codeCourse": { $eq: filters["codeCourse"] } }
      } else if ("courseName" in filters) {
        query = { "courseName": { $eq: filters["courseName"] } }
      } else if ("semesterOfLearning" in filters) {
        query = { "semesterOfLearning": { $eq: filters["semesterOfLearning"] } }
      } else if ("yearOfLearning" in filters) {
        query = { "yearOfLearning": { $eq: filters["yearOfLearning"] } }
      } else if ("englishUnits" in filters) {
        query = { "englishUnits": { $eq: filters["englishUnits"] } }
      } else if ("units" in filters) {
        query = { "units": { $eq: filters["units"] } }
      } else if ("typeOfCourse" in filters) {
        query = { "typeOfCourse": { $eq: filters["typeOfCourse"] } }
    }

    let cursor
    
    try {
      cursor = await coursesDetails
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { coursesDetailsList: [], totalNumCoursesDetailsList: 0 }
    }

    try {
      const coursesDetailsList = await cursor.toArray()
      const totalNumCoursesDetailsList = await coursesDetails.countDocuments(query)

      return { coursesDetailsList, totalNumCoursesDetailsList }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { coursesDetailsList: [], totalNumCoursesDetailsList: 0 }
    }
  }
}





  static async uploadDetailsCourses (filePath) {
      var arrayToInsert = [];
      console.log(filePath)
      const workBook = XLSX.readFile(filePath);
      XLSX.writeFile(workBook, filePath, { bookType: "csv" });
      csvtojson({flatKeys:true}).fromFile(filePath)
      .then(source => {
        // Fetching the all data from each row
        for (let i = 0; i < source.length; i++) {
          var oneRow = {
            codeCourse: source[i]["קוד קורס"],
            courseName: source[i]["שם קורס"],
            yearOfLearning: source[i]["שנה"],
            semesterOfLearning: source[i]["סמס"],
            typeOfCourse: source[i]["סוג"],
            englishUnits: parseInt(source[i]['ש"ס']),
            units: parseFloat(source[i]["נ.זיכוי"]),          
          };          
          arrayToInsert.push(oneRow);
        }
        fs.unlinkSync(filePath);
        coursesDetails.insertMany(arrayToInsert,(err, result) => {
          if (err){
            console.log("test")
            console.log(err);          
          }
          if(result){
              console.log("Import CSV into database successfully.");
          }
         //inserting into the table "courses"    
        });
        //console.log(arrayToInsert)
    });  
  }

  static async deleteAllCoursesDetails() {
    try {
      const deleteResponse = await coursesDetails.deleteMany()
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete coursesDetails: ${e}`)
      return { error: e }
    }
  }

  
      
}