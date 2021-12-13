import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let courses

export default class CoursesDAO {
  static async injectDB(conn) {
    if (courses) {
      return
    }
    try {
        courses = await conn.db(process.env.RESTREVIEWS_NS).collection("courses")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addCourse(courseName, grade, semesterOfLearning, yearOfLearning ,units, programStartDate, programEndDate, typeOfCourse, courseBefore, studentID) {
    try {
      const courseDoc = { 
          courseName: courseName,
          grade: grade,
          semesterOfLearning: semesterOfLearning,
          yearOfLearning: yearOfLearning,
          units: units,
          programStartDate: programStartDate,
          programEndDate: programEndDate,
          typeOfCourse: typeOfCourse,
          courseBefore: courseBefore,
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
        { user_id: userId, _id: ObjectId(courseID)},
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

}