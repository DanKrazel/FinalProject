import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let students

export default class StudentsDAO {
  static async injectDB(conn) {
    if (students) {
      return
    }
    try {
        students = await conn.db(process.env.RESTREVIEWS_NS).collection("students")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in studentsDAO: ${e}`,
      )
    }
  }

  static async getStudents({
    filters = null,
    page = 0,
    studentsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("student_id" in filters) {
        query = { "name": { $eq: filters["student_id"] } }
      } else if ("name" in filters) {
        query = { "name": { $eq: filters["name"] } }
      } else if ("units" in filters) {
        query = { "units": { $eq: filters["units"] } }
      }
    }

    let cursor
    
    try {
      cursor = await students
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { studentsList: [], totalNumStudentsList: 0 }
    }

    const displayCursor = cursor.limit(studentsPerPage).skip(studentsPerPage * page)

    try {
      const studentsList = await displayCursor.toArray()
      const totalNumStudents = await students.countDocuments(query)

      return { studentsList, totalNumStudents }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { studentsList: [], totalNumStudents: 0 }
    }
  }
  static async getStudentsByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await students.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getNames() {
    let cuisines = []
    try {
      courses = await restaurants.distinct("courses")
      return courses
    } catch (e) {
      console.error(`Unable to get courses, ${e}`)
      return courses
    }
  }

  static async addStudent (studentID, name, average, units, courses) {
    try {
      const studentDoc = { 
          student_id: studentID,
          name: name,
          average: average,
          units: units,
          courses: courses}

      return await students.insertOne(studentDoc)
    } catch (e) {
      console.error(`Unable to post student: ${e}`)
      return { error: e }
    }
  }
}
