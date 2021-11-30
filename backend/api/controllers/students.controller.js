import StudentsDAO from "../../dao/studentsDAO.js"

export default class  StudentsController {
  static async apiGetStudents(req, res, next) {
    const studentsPerPage = req.query.studentsPerPage ? parseInt(req.query.studentsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.student_id) {
      filters.student_id = req.query.student_id
    } else if (req.query.name) {
      filters.name = req.query.name
    } else if (req.query.units) {
      filters.units = req.query.units
    }

    const { studentsList, totalNumStudents } = await StudentsDAO.getStudents({
      filters,
      page,
      studentsPerPage,
    })

    let response = {
      students: studentsList,
      page: page,
      filters: filters,
      entries_per_page: studentsPerPage,
      total_results: totalNumStudents,
    }
    res.json(response)
  }
  static async apiGetStudentById(req, res, next) {
    try {
      let id = req.params.id || {}
      let student = await StudentsDAO.getStudentsByID(id)
      if (!student) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(student)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetStudentName(req, res, next) {
    try {
      let cuisines = await StudentsDAO.getNames()
      res.json(cuisines)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostStudent(req, res, next) {
    try {
      const studentID = req.body.student_id
      const name = req.body.name
      const average = req.body.average
      const units = req.body.units
      const courses = {
        name: req.body.courses.name,
        course_id: req.body.courses.course_id
      }
      const StudentResponse = await StudentsDAO.addStudent(
        studentID,
        name,
        average,
        units,
        courses,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}