import CoursesDAO from "../../dao/coursesDAO.js"

export default class CoursesController {
  static async apiPostCourse(req, res, next) {
    try {
      const courseName = req.body.courseName
      const grade = req.body.grade
      const yearOfLearning = req.body.yearOfLearning
      const units = req.body.units
      const programStartDate = req.body.programStartDate
      const programEndDate = req.body.programEndDate
      const typeOfCourse = req.body.typeOfCourse
      const courseBefore = req.body.courseBefore
      const studentID = req.body.studentID

      const CourseResponse = await CoursesDAO.addCourse(
        courseName,
        grade,
        yearOfLearning,
        units,
        programStartDate,
        programEndDate,
        typeOfCourse,
        courseBefore,
        studentID
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

      const courseResponse = await CoursesDAO.updateCourse(
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

  static async apiDeleteCourse(req, res, next) {
    try {
      const courseID = req.query.id
      const userId = req.body.user_id
      console.log(courseID)
      const courseResponse = await CoursesDAO.deleteCourse(
        courseID,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}