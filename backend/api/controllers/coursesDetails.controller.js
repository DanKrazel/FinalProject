import CoursesDetailsDAO from "../../dao/coursesDetailsDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId


export default class CoursesController {

  static async apiGetCoursesDetails(req, res, next) {
    let filters = {}
    if (req.query._id) {
      filters._id = req.query._id
    }else if (req.query.codeCourse) {
      filters.codeCourse = req.query.codeCourse
    }else if (req.query.courseName) {
      filters.courseName = req.query.courseName
    } else if (req.query.yearOfLearning) {
        filters.yearOfLearning = req.query.yearOfLearning
    } else if (req.query.semesterOfLearning) {
        filters.semesterOfLearning = req.query.semesterOfLearning
    } else if (req.query.englishUnits) {
      filters.englishUnits = req.query.englishUnits
    } else if (req.query.units) {
      filters.units = req.query.units
    } else if (req.query.typeOfCourse) {
        filters.typeOfCourse = req.query.typeOfCourse
    } 


    const { coursesDetailsList, totalNumCoursesDetailsList} = await CoursesDetailsDAO.getCoursesDetails({
      filters,
    })

    let response = {
      coursesDetails: coursesDetailsList,
      filters: filters,
      total_results: totalNumCoursesDetailsList,
    }
    res.json(response)
  }

  static async apiPostCourseDetails(req, res, next) {
    try {
      const codeCourse = req.body.codeCourse
      const yearOfLearning = req.body.yearOfLearning
      const semesterOfLearning = req.body.semesterOfLearning
      const courseName = req.body.courseName
      const typeOfCourse = req.body.typeOfCourse
      const englishUnits = req.body.englishUnits
      const units = req.body.units


      const CourseResponse = await CoursesDetailsDAO.addCourse(
        codeCourse,
        yearOfLearning,
        semesterOfLearning,
        courseName,
        typeOfCourse,
        englishUnits,
        units
      )
      if(CourseResponse){
        res.json({ status: "success" })
      }
      else{
        res.json({ status: "failed"})
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateCourse(req, res, next) {
    try {
      const courseID = req.body.course_id
      const text = req.body.text
      const date = new Date()

      const courseResponse = await CoursesDetailsDAO.updateCourse(
        courseID,
        req.body.user_id,
        text,
        date,
      )

      var { error } = courseResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (courseResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update course - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteCourseDetails(req, res, next) {
    try {
      const courseID = req.query.courseID
      console.log(courseID)
      const courseResponse = await CoursesDetailsDAO.deleteCourse(
        courseID,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  static async apiDeleteAllCoursesDetails(req, res, next) {
    try {
      const courseResponse = await CoursesDetailsDAO.deleteAllCoursesDetails()
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUploadDetailsCourses(req, res) {
    try{
      const file = req.file.path
      const CoursesResponse = await CoursesDetailsDAO.uploadDetailsCourses(
        file
        )
      res.json({ status: "success"})
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  

  

}