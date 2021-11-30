import express from "express"
import StudentsCtrl from "../controllers/students.controller.js"

const router = express.Router()

router.route("/").get(StudentsCtrl.apiGetStudents)
                 .post(StudentsCtrl.apiPostStudent)

export default router