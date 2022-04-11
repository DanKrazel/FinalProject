import express from "express"
import StudentsCtrl from "../controllers/students.controller.js"
import UsersCtrl from "../controllers/users.controller.js"
import CoursesCtrl from "../controllers/course.controller.js"
import UnitsBySemesterCtrl from "../controllers/unitsBySemester.controller.js"
import FilesCtrl from "../controllers/files.controller.js"
import RequestsCtrl from "../controllers/requests.controller.js"
import upload from "../../middleware/upload.js"



const router = express.Router()


router.route("/").get(StudentsCtrl.apiGetStudents)
                 .post(StudentsCtrl.apiPostStudent)

router.route("/getStudentByID").get(StudentsCtrl.apiGetStudentByID)

router.route("/getUnitStudent/:id").get(StudentsCtrl.apiGetUnitStudent)
router.route("/getAverageStudent/:id").get(StudentsCtrl.apiGetAverageStudent)
router.route("/resetAverageStudent").put(StudentsCtrl.apiResetAverageStudent)
router.route("/updateAverageStudent").put(StudentsCtrl.apiUpdateAverageStudent)
router.route("/updateUnitStudent").put(StudentsCtrl.apiUpdateUnitStudent)
router.route("/testToken").get(UsersCtrl.apiVerifyToken)

router.route("/user").get(UsersCtrl.apiGetUsers)
                     .post(UsersCtrl.apiPostUser)

router.route("/requests").post(RequestsCtrl.apiPostRequest)
                         .get(RequestsCtrl.apiGetRequests)

router.route("/requests/:id").delete(RequestsCtrl.apiDeleteRequestBystudentID)
router.route("/requestSent").get(RequestsCtrl.apiGetRequestSent)
router.route("/retrievInfoByRequest").get(RequestsCtrl.apiRetrieveinfoByRequest)

router.route("/login").post(UsersCtrl.apiLogin)
router.route("/signup").post(UsersCtrl.apiCheckDuplicateUsernameOrMail, UsersCtrl.apiSignup)
router.route("/checkDuplicateUsernameOrEmail").get(UsersCtrl.apiCheckAuthentification)

router.route("/admin").get(UsersCtrl.apiVerifyToken,
                           UsersCtrl.apiIsAdmin, 
                           UsersCtrl.apiAdminBoard)

router.route("/secretariat").get(UsersCtrl.apiVerifyToken,
                           UsersCtrl.apiIsSecretariat, 
                           UsersCtrl.apiSecretariatBoard)

router.route("/professor").get(UsersCtrl.apiVerifyToken,
                            UsersCtrl.apiIsProfessor, 
                            UsersCtrl.apiProfessorBoard)
                           
router.route("/names").get(StudentsCtrl.apiGetStudentName)
router.route("/getCoursesStudent/:id").get(StudentsCtrl.apiGetCoursesStudentByID)
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