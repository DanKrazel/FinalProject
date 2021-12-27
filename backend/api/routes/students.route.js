import express from "express"
import StudentsCtrl from "../controllers/students.controller.js"
import UsersCtrl from "../controllers/users.controller.js"
import CoursesCtrl from "../controllers/course.controller.js"

const router = express.Router()

router.route("/").get(StudentsCtrl.apiGetStudents)
                 .post(StudentsCtrl.apiPostStudent)
router.route("/user").get(UsersCtrl.apiGetUsers)
                     .post(UsersCtrl.apiPostUser)
router.route("/login").post(UsersCtrl.apiCheckAuthentification)
router.route("/names").get(StudentsCtrl.apiGetStudentName)
router.route("/:id").get(StudentsCtrl.apiGetStudentByID)
router.route("/course").post(CoursesCtrl.apiPostCourse)
                       .put(CoursesCtrl.apiUpdateCourse)
                       .delete(CoursesCtrl.apiDeleteCourse)
                       .get(CoursesCtrl.apiGetCourses)
                       .get(CoursesCtrl.apiGetCoursesByStudentID)
                       


export default router