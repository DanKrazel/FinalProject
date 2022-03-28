import express from "express"
import StudentsCtrl from "../controllers/students.controller.js"
import UsersCtrl from "../controllers/users.controller.js"
import CoursesCtrl from "../controllers/course.controller.js"
import UnitsBySemesterCtrl from "../controllers/unitsBySemester.controller.js"
import FilesCtrl from "../controllers/files.controller.js"
import upload from "../../middleware/upload.js"

const router = express.Router()

router.route("/").get(StudentsCtrl.apiGetStudents)
                 .post(StudentsCtrl.apiPostStudent)
router.route("/getUnitStudent/:id").get(StudentsCtrl.apiGetUnitStudent)
router.route("/updateUnitStudent").put(StudentsCtrl.apiUpdateUnitStudent)
router.route("/user").get(UsersCtrl.apiGetUsers)
                     .post(UsersCtrl.apiPostUser)
router.route("/login").post(UsersCtrl.apiCheckAuthentification)
router.route("/names").get(StudentsCtrl.apiGetStudentName)
router.route("/getCoursesStudent/:id").get(StudentsCtrl.apiGetStudentByID)
router.route("/course").post(CoursesCtrl.apiPostCourse)
                       .put(CoursesCtrl.apiUpdateCourse)
                       .delete(CoursesCtrl.apiDeleteCourse)
                       .get(CoursesCtrl.apiGetCourses)
                       .get(CoursesCtrl.apiGetCoursesByStudentID)
router.route("/course/:id").delete(CoursesCtrl.apiDeleteCourseBystudentID)
router.route("/uploadCourses/:id").post(CoursesCtrl.apiUploadCoursesToDB)
router.route("/unitsBySemester").get(UnitsBySemesterCtrl.apiGetUnitsBySemester)
                                .put(UnitsBySemesterCtrl.apiUpdateUnitsSemesters)
router.route("/unitsBySemester/:id").delete(UnitsBySemesterCtrl.apiDeleteUnitsBySemesterStudentID)
                                    
router.route("/uploadFile/:id").post(upload.single('file'),FilesCtrl.apiNewTestPostFile)
                           .get(FilesCtrl.apiGetFiles)
                       


export default router