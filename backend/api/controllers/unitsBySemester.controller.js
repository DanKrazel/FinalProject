import unitsBySemesterDAO from "../../dao/unitsBySemesterDAO.js"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId


export default class CoursesController {

  static async apiGetUnitsBySemester(req, res, next) {
    const unitsSemesterPerPage = req.query.unitsSemesterPerPage ? parseInt(req.query.unitsSemesterPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0
    let filters = {}
    if (req.query._id) {
      filters._id = req.query._id
    } else if (req.query.semesterOfLearning) {
        filters.semesterOfLearning = req.query.semesterOfLearning
    } else if (req.query.yearOfLearning) {
      filters.yearOfLearning = req.query.yearOfLearning
    } else if (req.query.units) {
      filters.units = req.query.units
    } else if (req.query.studentID) {
      filters.studentID = ObjectId(req.query.studentID)
    }


    const { unitsBySemesterList, totalNumUnitsBySemester} = await unitsBySemesterDAO.getUnitsBySemester({
      filters,
      page,
      unitsSemesterPerPage,
    })

    let response = {
      unitsBySemester: unitsBySemesterList,
      page: page,
      filters: filters,
      entries_per_page: unitsSemesterPerPage,
      total_results: totalNumUnitsBySemester,
    }
    res.json(response)
  }

  static async apiPostUnitsBySemester(req, res, next) {
    try {
      const yearOfLearning = req.body.yearOfLearning
      const semesterOfLearning = req.body.semesterOfLearning
      const units = req.body.units
      const studentID = req.body.studentID

      const unitsBySemesterResponse = await unitsBySemesterDAO.addUnitSemester(
        yearOfLearning,
        semesterOfLearning,
        units,
        studentID
      )
      if(unitsBySemesterResponse){
        res.json({ status: "success" })
      }
      else{
        res.json({ status: "failed"})
      }
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteUnitsBySemesterStudentID(req, res, next) {
    try {
      const studentID = req.params.id || {}
      console.log(studentID)
      const courseResponse = await unitsBySemesterDAO.deleteUnitsByStudentID(
        studentID
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateUnitsSemesters(req, res, next) {
    try {
      const yearOfLearning = req.body.yearOfLearning
      const semesterOfLearning = req.body.semesterOfLearning
      const units = req.body.units
      const studentID = req.body.studentID

      console.log(yearOfLearning)
      console.log(semesterOfLearning)
      console.log(units)
      console.log(studentID)

      const unitsBySemesterResponse = await unitsBySemesterDAO.updateUnitsSemester(
        studentID,
        yearOfLearning,
        semesterOfLearning,
        units,
      )

      console.log(unitsBySemesterResponse)
      var { error } = unitsBySemesterResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (unitsBySemesterResponse.modifiedCount == 0) {
        throw new Error(
          "unable to update unitsBySemester - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

}