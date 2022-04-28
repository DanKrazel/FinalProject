import StudentsDAO from "../../dao/studentsDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

export default class  StudentsController {
  static async apiGetStudents(req, res, next) {
    const studentsPerPage = req.query.studentsPerPage ? parseInt(req.query.studentsPerPage, 10) : 6
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    let filters = {}
    if (req.query._id) {
      filters._id = ObjectId(req.query._id)
    }else if (req.query.student_id) {
      filters.student_id = req.query.student_id
    } else if (req.query.name) {
      filters.name = req.query.name
    } else if (req.query.totalunits) {
      filters.totalunits = req.query.totalunits
    } else if (req.query.valideunits) {
        filters.valideunits = req.query.valideunits
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
      totalPages: Math.ceil(totalNumStudents / studentsPerPage),
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
      const years = req.body.years
      const totalunits = req.body.totalunits
      const valideunits = req.body.valideunits
      const StudentResponse = await StudentsDAO.addStudent(
        studentID,
        name,
        average,
        years,
        totalunits,
        valideunits,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }


  static async apiGetStudentByID(req, res, next){
    try {
      let studentID = req.body.studentID
      console.log('id',id)
      let student = await StudentsDAO.getStudentByID(studentID)
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

  static async apiGetCoursesStudentByID(req, res, next){
    try {
      let id = req.params.id || {}
      console.log('id',id)
      let student = await StudentsDAO.getCoursesByStudentID(id)
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
      res.json(unit[0]["totalunits"])
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
  static async apiGetAverageStudent(req, res, next) {
    try {
      let id = req.params.id || {}
      let unit = await StudentsDAO.getAverageByStudentID(ObjectId(id))
      //console.log(unit[0]["units"])
      res.json(unit[0]["average"])
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
  
  static async apiUpdateUnitStudent(req, res, next) {
    try {
      const studentID = req.body.student_id
      const totalunits = req.body.totalunits
      const studentResponse = await StudentsDAO.updateUnitsStudent(
        studentID,
        totalunits,
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
  static async apiUpdateAverageStudent(req, res, next) {
    try {
      const studentID = req.body.student_id
      const studentResponse = await StudentsDAO.updateAverageStudent(
        studentID,
        average,
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
  static async apiResetAverageStudent(req, res, next) {
    try {
      const studentID = req.body.student_id
      const studentResponse = await StudentsDAO.updateAverageStudent(
        studentID,
        average,
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

  static async apiUploadStudentFromCSV(req, res) {
    try{
      const StudentResponse = await StudentsDAO.uploadStudentFromCSV(
        req.file.path, 
        )
      console.log("StudentResponse:", StudentResponse)
      res.json({ status: "success" })
    } catch (e) {
      console.log("heybackend")
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiDeleteAllStudent(req, res, next) {
    try {
      const StudentResponse = await StudentsDAO.deleteAllStudent()
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
  
}