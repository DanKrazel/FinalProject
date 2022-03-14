import StudentsDAO from "../../dao/studentsDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

export default class  StudentsController {
  static async apiGetStudents(req, res, next) {
    const studentsPerPage = req.query.studentsPerPage ? parseInt(req.query.studentsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    let filters = {}
    if (req.query._id) {
      filters._id = ObjectId(req.query._id)
    }else if (req.query.student_id) {
      filters.student_id = req.query.student_id
    } else if (req.query.name) {
      filters.name = req.query.name
    } else if (req.query.units) {
      filters.units = req.query.units
    } else if (req.query.yearsOfLearning) {
      filters.yearsOfLearning = req.query.yearsOfLearning
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
  /*static async apiGetStudentById(req, res, next) {
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
  }*/

  static async apiGetStudentName(req, res, next) {
    try {
      let names = await StudentsDAO.getNames()
      res.json(names)
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
      const years = req.body.years
      const StudentResponse = await StudentsDAO.addStudent(
        studentID,
        name,
        average,
        units,
        years,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiGetStudentByID(req, res, next){
    try {
      let id = req.params.id || {}
      console.log('id',id)
      let student = await StudentsDAO.getStudentByID(id)
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

  static async apiGetUnitStudent(req, res, next) {
    try {
      let id = req.params.id || {}
      let unit = await StudentsDAO.getUnitByStudentID(ObjectId(id))
      //console.log(unit[0]["units"])
      res.json(unit[0]["units"])
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiUpdateUnitStudent(req, res, next) {
    try {
      const studentID = req.body.student_id
      const units = req.body.units

      const studentResponse = await StudentsDAO.updateUnitsStudent(
        studentID,
        units,
      )

      var { error } = studentResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (studentResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update student unit",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


}