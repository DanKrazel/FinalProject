import express from "express"
import StudentsCtrl from "../controllers/students.controller.js"
import UsersCtrl from "../controllers/users.controller.js"
import CoursesCtrl from "../controllers/course.controller.js"
import UnitsBySemesterCtrl from "../controllers/unitsBySemester.controller.js"
import FilesCtrl from "../controllers/files.controller.js"
import RequestsCtrl from "../controllers/requests.controller.js"
import DependenciesCtrl from "../controllers/dependencies.controller.js"
import CourseDetailsCtrl from "../controllers/coursesDetails.controller.js"
import ImageVisualizationCtrl from "../controllers/imageVisualization.controller.js"

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
router.route("/uploadStudents").post(upload.single('file'),StudentsCtrl.apiUploadStudentFromCSV)
router.route("/deleteAllStudents").delete(StudentsCtrl.apiDeleteAllStudent)
router.route("/testToken").get(UsersCtrl.apiVerifyToken)

router.route("/user").get(UsersCtrl.apiGetUsers)
                     .post(UsersCtrl.apiPostUser)
                     //.delete(UsersCtrl.apiDeleteUserByID)
                     .delete(UsersCtrl.apiDeleteUser)

router.route("/requests").post(RequestsCtrl.apiPostRequest)
                         .get(RequestsCtrl.apiGetRequests)
                         .delete(RequestsCtrl.apiDeleteRequestByID)

router.route("/imageVisualization").post(upload.single('file'),ImageVisualizationCtrl.apiPostImageVisualization)
                                   .get(ImageVisualizationCtrl.apiGetImageVisualization)
                                   .delete(ImageVisualizationCtrl.apiDeleteImageVisualizationByID)

//router.route("/requests/:id").delete(RequestsCtrl.apiDeleteRequestBystudentID)
router.route("/requests/:id").delete(RequestsCtrl.apiDeleteRequestBystudentID)
router.route("/requestSent").get(RequestsCtrl.apiGetRequestSent)
router.route("/retrieveInfoByRequest").get(RequestsCtrl.apiRetrieveinfoByRequest)
router.route("/deleteAllRequests").delete(RequestsCtrl.apiDeleteAllRequests)


router.route("/dependencies").get(DependenciesCtrl.apiGetDependencies)
                             .post(DependenciesCtrl.apiPostDependencies)

router.route("/login").post(UsersCtrl.apiLogin)
router.route("/signup").post(UsersCtrl.apiCheckDuplicateUsernameOrMail, 
                            UsersCtrl.apiSignup)

router.route("/admin").get(UsersCtrl.apiVerifyToken,
                           UsersCtrl.apiIsAdmin, 
                           UsersCtrl.apiAdminBoard)

router.route("/secretariat").get(UsersCtrl.apiVerifyToken,
                           UsersCtrl.apiIsSecretariat, 
                           UsersCtrl.apiSecretariatBoard)

router.route("/professor").get(UsersCtrl.apiVerifyToken,
                            UsersCtrl.apiIsProfessor, 
                            UsersCtrl.apiProfessorBoard)

router.route("/refreshToken").post(UsersCtrl.apiRefreshToken)
                           
router.route("/names").get(StudentsCtrl.apiGetStudentName)
router.route("/getCoursesStudent/:id").get(StudentsCtrl.apiGetCoursesStudentByID)
router.route("/deleteAllCourses").delete(CoursesCtrl.apiDeleteAllCourses)
router.route("/getCoursesByStudentName").get(StudentsCtrl.apiGetCoursesByStudentName)                             
router.route("/uploadCourses/:id").post(upload.single('file'),CoursesCtrl.apiUploadCourses)
router.route("/uploadCoursesAllStudents").post(upload.single('file'),CoursesCtrl.apiUploadCoursesAllStudents)
router.route("/getCoursesDetails").get(CoursesCtrl.apiGetCoursesDetail)
router.route("/course").post(CoursesCtrl.apiPostCourse)
                       .put(CoursesCtrl.apiUpdateCourse)
                       .delete(CoursesCtrl.apiDeleteCourse)
                       .get(CoursesCtrl.apiGetCourses)



router.route("/uploadDetailsCourses").post(upload.single('file'),CourseDetailsCtrl.apiUploadDetailsCourses)
router.route("/deleteAllCoursesDetails").delete(CourseDetailsCtrl.apiDeleteAllCoursesDetails)
router.route("/courseDetails").post(CourseDetailsCtrl.apiPostCourseDetails)
                              .put(CourseDetailsCtrl.apiUpdateCourse)
                              .delete(CourseDetailsCtrl.apiDeleteCourseDetails)
                              .get(CourseDetailsCtrl.apiGetCoursesDetails)



router.route("/course/:id").delete(CoursesCtrl.apiDeleteCourseBystudentID)
//router.route("/uploadCourses/:id").post(CoursesCtrl.apiUploadCoursesToDB)

router.route("/unitsBySemester").get(UnitsBySemesterCtrl.apiGetUnitsBySemester)
                                .put(UnitsBySemesterCtrl.apiUpdateUnitsSemesters)
router.route("/unitsBySemester/:id").delete(UnitsBySemesterCtrl.apiDeleteUnitsBySemesterStudentID)
                       
router.route("/uploadPDF").post(upload.single('file'),FilesCtrl.apiNewTestPostFile)

router.route("/uploadPDFCourses").get(FilesCtrl.apiParsePDF)



export default router