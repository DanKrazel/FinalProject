import mongodb from "mongodb"
import csvtojson from "csvtojson"
import multer from "multer"
import fs from "fs"
import XLSX from "xlsx"
import csv from "csv-parser"
import { v1 as uuidv1 } from 'uuid';

import StudentsDAO from "./studentsDAO.js"
const ObjectId = mongodb.ObjectId
import unitsBySemesterDAO from "./unitsBySemesterDAO.js"

let courses

export default class CoursesDAO {
  static async injectDB(conn) {
    if (courses) {
      return
    }
    try {
        courses = await conn.db(process.env.STUDREVIEWS_NS).collection("courses")
    } catch (e) {
      console.error(`Unable to establish collection handles in courseDAO: ${e}`)
    }
  }
  static async addCourse(codeCourse, courseName, grade, semesterOfLearning, yearOfLearning ,englishUnits, units, typeOfCourse, studentID) {
    try {
      const courseDoc = {
          codeCourse : codeCourse,
          yearOfLearning: yearOfLearning,
          semesterOfLearning: semesterOfLearning,
          courseName : courseName,
          typeOfCourse: typeOfCourse,
          englishUnits : englishUnits,
          units: units,
          grade: grade,
          /*programStartDate: programStartDate,
          programEndDate: programEndDate,
          courseBefore: courseBefore,*/
          studentID: ObjectId(studentID),}
          
      return await courses.insertOne(courseDoc)
    } catch (e) {
      console.error(`Unable to post course: ${e}`)
      return { error: e }
    }
  }
  static async updateCourse(courseID, userId, text, date) {
    try {
      const updateResponse = await courses.updateOne(
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
      const deleteResponse = await courses.deleteOne({
        _id: ObjectId(courseID),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete course: ${e}`)
      return { error: e }
    }
  }
  static async deleteCoursesByStudentID(studentID) {
    try {
      const deleteResponse = await courses.deleteMany({
        studentID: ObjectId(studentID),
      })
      // unitsBySemesterDAO.deleteUnitsByStudentID(studentID)
      // StudentsDAO.updateUnitsStudent(studentID)
      // StudentsDAO.resetAverageStudent(studentID)
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete course: ${e}`)
      return { error: e }
    }
  }

  static async deleteAllCourses() {
    try {
      const deleteResponse = await courses.deleteMany({
      })
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete course: ${e}`)
      return { error: e }
    }
  }


  static async getCourses({
    filters = null,
    page = 0,
    coursesPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("_id" in filters) {
        query = { "_id": { $eq: filters["_id"] } }
      } else if ("codeCourse" in filters) {
        query = { "codeCourse": { $eq: filters["codeCourse"] } }
      } else if ("courseName" in filters) {
        query = { "courseName": { $eq: filters["courseName"] } }
      } else if ("grade" in filters) {
        query = { "grade": { $eq: filters["grade"] } }
      } else if ("semesterOfLearning" in filters) {
        query = { "semesterOfLearning": { $eq: filters["semesterOfLearning"] } }
      } else if ("yearOfLearning" in filters) {
        query = { "yearOfLearning": { $eq: filters["yearOfLearning"] } }
      } else if ("englishUnits" in filters) {
        query = { "englishUnits": { $eq: filters["englishUnits"] } }
      } else if ("units" in filters) {
        query = { "units": { $eq: filters["units"] } }
      } else if ("programStartDate" in filters) {
        query = { "programStartDate": { $eq: filters["programStartDate"] } }
      } else if ("programEndDate" in filters) {
        query = { "programEndDate": { $eq: filters["unprogramEndDateits"] } }
      } else if ("typeOfCourse" in filters) {
        query = { "typeOfCourse": { $eq: filters["typeOfCourse"] } }
      } else if ("courseBefore" in filters) {
        query = { "courseBefore": { $eq: filters["courseBefore"] } }
      } else if ("studentName" in filters) {
        query = { "studentName": { $eq: filters["studentName"] } }
      }
    }

    let cursor
    
    try {
      cursor = await courses
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { coursesList: [], totalNumCoursesList: 0 }
    }

    const displayCursor = cursor.limit(coursesPerPage).skip(coursesPerPage * page)

    try {
      const coursesList = await displayCursor.toArray()
      const totalNumCourses = await courses.countDocuments(query)

      return { coursesList, totalNumCourses }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { coursesList: [], totalNumCourses: 0 }
    }
  }
  
  static async getCoursesByStudentID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
        {
          $lookup: {
              from: "courses",
              let: {
                  id: "$_id",
              },
              pipeline: [
                  {
                      $match: {
                          $expr: {
                          $eq: ["$studentName", "$$id"],
                          },
                      },
                  },
                  {
                      $sort: {
                          date: -1,
                      },
                  },
              ],
              as: "courses",
          },
      },
      {
          $addFields: {
              courses: "$courses",
          },
      },
          ]
        console.log(pipeline)
      return await students.aggregate(pipeline).next()
    } catch (e) {
      console.log("test")
      console.error(`Something went wrong in getCoursesByStudentID: ${e}`)
      throw e
    }
  }



  


  static async uploadCourses (fileName, studentID) {
    // CSV file name
      //const fileName = "sample.csv";
      var arrayToInsert = [];
      console.log(fileName)
      csvtojson().fromFile(fileName).then(source => {
      console.log("source:", source)
      //console.log(source)
      // Fetching the all data from each row
      for (var i = 0; i < source.length; i++) {
        if(source[i]["?????? ????????"]!=""   ){
        var oneRow = {
          codeCourse: source[i]["?????? ????????"],
          yearOfLearning: source[i]["??????"],
          semesterOfLearning: source[i]["??????"],
          courseName: source[i]["???? ????????"],
          typeOfCourse: source[i]["??????"],
          englishUnits: parseInt(source[i]['??"??']),
          units: parseFloat(source[i]["??.??????????"]),
          grade: parseInt(source[i]["????????"]),
          studentID: ObjectId(studentID)
        };
        console.log(oneRow)
        arrayToInsert.push(oneRow);
        //students.updateOne({units:units+courseUnits})
        //StudentsDAO.updateUnitsStudent(studentID, source[i]["????????????"])
        }
        else{
          console.log("Miss field on csv file, check your file")
        }
      }
      console.log(arrayToInsert[0]["courseName"]);     
      fs.unlinkSync(fileName);
      console.log("arrayToInsert : ")
      //console.log(arrayToInsert)
        courses.insertMany(arrayToInsert, (err, result) => {
        if (err)
          console.log(err);
        if(result){
            console.log("Import CSV into database successfully.");
        }
       //inserting into the table "courses"    
    });
  });
  }

  static async uploadCoursesAllStudents (filePath) {
    // CSV file name
      //const fileName = "sample.csv";
      var flag = 0;
      var yearOfLearning;
      var count  = 0;     
      console.log(filePath)
      const results = [];
      const workbookTest = XLSX.utils.book_new();
      const workBook = XLSX.readFile(filePath)
      for(let i=0; i<workBook.SheetNames.length; i++){
        var arrayToInsert = [];
        var csv = XLSX.utils.sheet_to_csv(workBook.Sheets[workBook.SheetNames[i]]);
        csvtojson({
          noheader: false,
          headers: ["?????? ????????","??????","???? ????????","??????","???? ????????",'??"??',"??.??????????","????????"],
          flatKeys:true
        })    
        .fromString(csv)
        .then(source => {
          if(flag == 0){
            yearOfLearning = source[0]['?????? ????????']
            flag = 1
          }
        // Fetching the all data from each row
        for (var j = 0; j < source.length; j++) {
          if(source[j]["?????? ????????"] != "????????" && source[j]["?????? ????????"] != "?????? ????????" ){
          var oneRow = {
            codeCourse: source[j]["?????? ????????"],
            yearOfLearning: yearOfLearning,
            semesterOfLearning: source[j]["??????"],
            courseName: source[j]["???? ????????"],
            typeOfCourse: source[j]["??????"],
            profName: source[j]["???? ????????"],
            englishUnits: parseInt(source[j]['??"??']),
            units: parseFloat(source[j]["??.??????????"]),
            grade: parseInt(source[j]["????????"]),
            studentName: workBook.SheetNames[i].slice(0,workBook.SheetNames[i].length - 2)
          };
          //console.log(oneRow)
          
          arrayToInsert.push(oneRow);
          }
        }
        courses.insertMany(arrayToInsert,{ordered:false},(err, result) => {
          if (err){
            //console.log(err);
            //fs.unlinkSync(filePath);
          }
          if(result){
              // console.log(result)
              console.log("Import CSV into database successfully.");
          }
         //inserting into the table "courses"    
        });
        //console.log(arrayToInsert)
         });
      }
      fs.unlinkSync(filePath);
  }
      
  static async getCoursesDetails(studentName) {
    try {
      const pipeline = [
        {
            $match: {
              // codeCourse: codeCourse,
              studentName: studentName
            },
        },
        {
          $lookup: {
              from: "coursesDetails",
              let: {
                codeCourse: "$codeCourse",
              },
              pipeline: [
                  {
                      $match: {
                          $expr: {
                              $eq: ["$codeCourse", "$$codeCourse"],
                          },
                      },
                  },
                  {
                      $sort: {
                          date: -1,
                      },
                  },
              ],
              as: "coursesDetails",
          },
      },
      {
          $addFields: {
            coursesDetails: "$coursesDetails",
          },
      },
          ]
      return await courses.aggregate(pipeline).toArray()
    } catch (e) {
      console.error(`Something went wrong in getCoursesDetails: ${e}`)
      throw e
    }
  }

}