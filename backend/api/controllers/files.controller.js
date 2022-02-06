import CoursesDAO from "../../dao/coursesDAO.js"

export default class CoursesController {


  static async apiPostCourse(req, res, next) {
    try {
      const codeCourse = req.body.codeCourse

      const CourseResponse = await CoursesDAO.addCourse(
        codeCourse,
        courseName,
        grade,
        semesterOfLearning,
        yearOfLearning,
        englishUnits,
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

 

}