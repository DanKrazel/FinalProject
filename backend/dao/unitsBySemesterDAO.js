import mongodb from "mongodb"
import csvtojson from "csvtojson"
import multer from "multer"
import fs from "fs"
import StudentsDAO from "./studentsDAO.js"
const ObjectId = mongodb.ObjectId

let unitsBySemester

export default class CoursesDAO {
  static async injectDB(conn) {
    if (unitsBySemester) {
      return
    }
    try {
        unitsBySemester = await conn.db(process.env.RESTREVIEWS_NS).collection("unitsBySemester")
    } catch (e) {
      console.error(`Unable to establish collection handles in unitsBySemesterrDAO: ${e}`)
    }
  }


  static async addUnitSemester(yearOfLearning, semesterOfLearning, units, studentID) {
    try {
      const unitsSemesterDoc = {
          yearOfLearning: yearOfLearning,
          semesterOfLearning: semesterOfLearning,
          units: units,
          studentID: ObjectId(studentID),}
          
      return await unitsSemester.insertOne(unitsSemesterDoc)
    } catch (e) {
      console.error(`Unable to post unitsSemester: ${e}`)
      return { error: e }
    }
  }

  static async updateUnitsSemester(studentID, yearOfLearning, semesterOfLearning, units) {
    try {
      const updateResponse = await unitsBySemester.updateOne(
        { yearOfLearning: yearOfLearning ,
        semesterOfLearning: semesterOfLearning,
        studentID: ObjectId(studentID)},
        { $set: { units: units} },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update unitsSemester: ${e}`)
      return { error: e }
    }
  }

  static async deleteUnitsSemester(unitsSemesterID) {
    try {
      const deleteResponse = await unitsBySemester.deleteOne({
        _id: ObjectId(unitsSemesterID),
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete unitsSemester: ${e}`)
      return { error: e }
    }
  }

  static async deleteUnitsByStudentID(studentID) {
    try {
      const deleteResponse = await unitsBySemester.deleteMany({
        studentID: ObjectId(studentID),
      })
      //StudentsDAO.updateUnitsStudent(studentID)
      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete unitsBySemester: ${e}`)
      return { error: e }
    }
  }

  static async getUnitsBySemester({
    filters = null,
    page = 0,
    unitsSemesterPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("_id" in filters) {
        query = { "_id": { $eq: filters["_id"] } }
      } else if ("semesterOfLearning" in filters) {
        query = { "semesterOfLearning": { $eq: filters["semesterOfLearning"] } }
      } else if ("yearOfLearning" in filters) {
        query = { "yearOfLearning": { $eq: filters["yearOfLearning"] } }
      } else if ("units" in filters) {
        query = { "units": { $eq: filters["units"] } }
      } else if ("studentID" in filters) {
        query = { "studentID": { $eq: filters["studentID"] } }
      }
    }

    let cursor
    
    try {
      cursor = await unitsBySemester
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { unitsBySemesterList: [], totalNumUnitsBySemester: 0 }
    }

    const displayCursor = cursor.limit(unitsSemesterPerPage).skip(unitsSemesterPerPage * page)

    try {
      const unitsBySemesterList = await displayCursor.toArray()
      const totalNumUnitsBySemester = await unitsBySemester.countDocuments(query)

      return { unitsBySemesterList, totalNumUnitsBySemester }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { unitsBySemesterList: [], totalNumUnitsBySemester: 0 }
    }
  }



}