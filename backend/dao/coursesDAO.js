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
  static async getCourses({
    filters = null,
    page = 0,
    coursesPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("_id" in filters) {
        query = { "_id": { $eq: filters["_id"] } }
      } else if ("courseName" in filters) {
        query = { "courseName": { $eq: filters["courseName"] } }
      } else if ("grade" in filters) {
        query = { "grade": { $eq: filters["grade"] } }
      } else if ("semesterOfLearning" in filters) {
        query = { "semesterOfLearning": { $eq: filters["semesterOfLearning"] } }
      } else if ("yearOfLearning" in filters) {
        query = { "yearOfLearning": { $eq: filters["yearOfLearning"] } }
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
      } else if ("studentID" in filters) {
        query = { "studentID": { $eq: filters["studentID"] } }
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
                              $eq: ["$studentID", "$$id"],
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
      console.error(`Something went wrong in getCoursesByStudentID: ${e}`)
      throw e
    }
  }


}