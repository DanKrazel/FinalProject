import CoursesDAO from "../../dao/coursesDAO.js"

export default class CoursesController {
  static async apiGetCourses(req, res, next) {
    const coursesPerPage = req.query.coursesPerPage ? parseInt(req.query.coursesPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    let filters = {}
    if (req.query._id) {
      filters._id = req.query._id
    }else if (req.query.codeCourse) {
      filters.codeCourse = req.query.codeCourse
    }else if (req.query.courseName) {
      filters.courseName = req.query.courseName
    } else if (req.query.grade) {
      filters.grade = req.query.grade
    } else if (req.query.semesterOfLearning) {
        filters.semesterOfLearning = req.query.semesterOfLearning
    } else if (req.query.yearOfLearning) {
      filters.yearOfLearning = req.query.yearOfLearning
    } else if (req.query.englishUnits) {
      filters.englishUnits = req.query.englishUnits
    } else if (req.query.units) {
      filters.units = req.query.units
    } else if (req.query.programStartDate) {
      filters.programStartDate = req.query.programStartDate
    } else if (req.query.programEndDate) {
      filters.programEndDate = req.query.programEndDate
    } else if (req.query.typeOfCourse) {
        filters.typeOfCourse = req.query.typeOfCourse
    } else if (req.query.courseBefore) {
        filters.courseBefore = req.query.courseBefore
    } else if (req.query.studentID) {
        filters.studentID = req.query.studentID
    }


    const { coursesList, totalNumCourses} = await CoursesDAO.getCourses({
      filters,
      page,
      coursesPerPage,
    })

    let response = {
      courses: coursesList,
      page: page,
      filters: filters,
      entries_per_page: coursesPerPage,
      total_results: totalNumCourses,
    }
    res.json(response)
  }
  static async apiPostCourse(req, res, next) {
    try {
      const codeCourse = req.body.codeCourse
      const courseName = req.body.courseName
      const grade = req.body.grade
      const semesterOfLearning = req.body.semesterOfLearning
      const yearOfLearning = req.body.yearOfLearning
      const englishUnits = req.body.englishUnits
      const units = req.body.units
      const programStartDate = req.body.programStartDate
      const programEndDate = req.body.programEndDate
      const typeOfCourse = req.body.typeOfCourse
      const courseBefore = req.body.courseBefore
      const studentID = req.body.studentID

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
      const courseID = req.query.courseID
      console.log(courseID)
      const courseResponse = await CoursesDAO.deleteCourse(
        courseID,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteCourseBystudentID(req, res, next) {
    try {
      const studentID = req.params.id || {}
      console.log(studentID)
      const courseResponse = await CoursesDAO.deleteCoursesByStudentID(
        studentID
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetCoursesByStudentID(req, res, next){
    try {
      let id = req.params.id || {}
      console.log('id',id)
      let courses = await CoursesDAO.getCoursesByStudentID(id)
      if (!courses) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(courses)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiUploadCoursesToDB(req, res, next){
    try {
      //const filename = "C:/Users/dankr/OneDrive/Documents/GitHub/FinalProject/backend/csvFile/newTestCSV.csv"
      //console.log(filename)
      let file = req.body.filename
      let studentID = req.body.studentID
      console.log(file)
      console.log(studentID)
      //console.log('id',studentID)
      const CourseResponse = await CoursesDAO.uploadCSVtoDB(
        file, 
        studentID
        )
      if(CourseResponse)
        res.json({ status: "success" })
      else
        res.json({ status: "failed" })
      //res.json(CourseResponse)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

}