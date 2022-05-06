import React, { useState, useEffect, useRef } from "react";
import StudentDataService from "../services/studentService";
import CourseDataService from "../services/courseService";
import UnitsBySemesterDataService from "../services/unitsBySemesterService";
import { useParams, useNavigate } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Link } from "react-router-dom";
import "../App.css";
import * as arrowLine from 'arrow-line';
import styles from "../index.css"
import getCoordinate from "./getCoordinate.js";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { ReactComponent as TailSvg } from "../assets/redcross-resize.svg";
import { ReactComponent as HeadSvg } from "../assets/arrowHead-resize.svg";
import StudentsList from "./students-list";
import Student from "./students";
const StudentVisual = props => {
  const params = useParams();
  var countUnitSemesters = 0;
  var countUnitSemester2 = 0;
  console.log(params.id)
  var myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1
  }
  const initialStudentState = {
    student_id: null,
    name: "",
    average: "",
    valideunits: "",
    totalunits: "",
    semester: "",
    years: "",
    courses: []
  };
  const boxStyle = { border: 'grey solid 2px', borderRadius: '10px', padding: '5px' };
  const [student, setStudent] = useState(initialStudentState);
  const [unitsBySemester, setUnitsBySemester] = useState([])
  const [idCourse, setIdCourse] = useState()

  useEffect(() => {
    console.log("useEffect student")
    getStudent(params.id);
    getUnitsBySemester(params.id);
    updateTotalUnitForEachSemester();
  }, []);


  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time)
    )
  }

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
        // response.data.average = Math.round((response.data.average / response.data.totalunits) * 100) / 100
        // console.log(response)
        // if (response.data.courses != null) {
        //   response.data.courses = orderarray(response.data["courses"]);
        //   setStudent(response.data);
        // }
        // else {
        //   setStudent(response.data);
        // }
        // console.log(response.data);
        // console.log("student", student)
        StudentDataService.getCoursesByStudentName(response.data.name).then(response => {
          console.log('response.data', response.data)
          setStudent(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getUnitsBySemester = (id) => {
    UnitsBySemesterDataService.findUnitsBySemester(id)
      .then(response => {
        setUnitsBySemester(response.data.unitsBySemester);
        console.log(response.data.unitsBySemester);
        console.log("unitsBySemester", unitsBySemester);
      })
      .catch(e => {
        console.log(e);
      });
  };

  function courseChoicearray(courses, coursesChoice) {
    if (courses.find(({ courseName }) => courseName === 'עיבוד תמונה וראייה ממוחשבת')) {
      coursesChoice.push(courses.find(({ courseName }) => courseName === 'עיבוד תמונה וראייה ממוחשבת'));
    }
    return coursesChoice;
  }

  function courseGeneralarray(courses, coursesChoice) {
    if (courses.find(({ courseName }) => courseName === 'טניס')) {
      coursesChoice.push(courses.find(({ courseName }) => courseName === 'טניס'));
    }
    return coursesChoice;
  }

  function orderarray(courses) {
    var arrayToInserttemp = [];
    var k = 0;
    var p = courses.length;
    if (courses.find(({ courseName }) => courseName === 'חדו"א  - 1')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'חדו"א  - 1'));
    }
    if (courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה'));
    }
    arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I'));
    if (courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I'));
    }
    if (courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'));
    }
    if (courses.find(({ courseName }) => courseName === 'חדוא 2 להנדסת תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'חדוא 2 להנדסת תוכנה'));
    }
    if (courses.find(({ courseName }) => courseName === 'פיסיקה להנדסת תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'פיסיקה להנדסת תוכנה'));
    }
    if (courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים II')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים II'));
    }
    if (courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים II')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים II'));
    }
    if (courses.find(({ courseName }) => courseName === 'תכנות מונחה עצמים')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'תכנות מונחה עצמים'));
    }
    if (courses.find(({ courseName }) => courseName === 'מבוא להסתברות וסטטיסטיקה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'מבוא להסתברות וסטטיסטיקה'));
    }
    if (courses.find(({ courseName }) => courseName === 'יסודות הנדסת תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'יסודות הנדסת תוכנה'));
    }
    if (courses.find(({ courseName }) => courseName === 'מבנה נתונים-ה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'מבנה נתונים-ה'));
    }
    if (courses.find(({ courseName }) => courseName === 'עקרונות שפות תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'עקרונות שפות תוכנה'));
    }
    if (courses.find(({ courseName }) => courseName === 'בדיקות ואיכות בהנדסת תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'בדיקות ואיכות בהנדסת תוכנה'));
    }
    if (courses.find(({ courseName }) => courseName === 'הנדסת דרישות וניתוח תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'הנדסת דרישות וניתוח תוכנה'));
    }
    if (courses.find(({ courseName }) => courseName === 'אנגלית מדוברת')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'אנגלית מדוברת'));
    }
    if (courses.find(({ courseName }) => courseName === 'אוטומטים ושפות פורמאליות')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'אוטומטים ושפות פורמאליות'));
    }
    if (courses.find(({ courseName }) => courseName === 'אלגורתמים I')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'אלגורתמים I'));
    }
    if (courses.find(({ courseName }) => courseName === 'מבוא לתקשורת מחשבים')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'מבוא לתקשורת מחשבים'));
    }
    if (courses.find(({ courseName }) => courseName === 'אנליזה נומרית')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'אנליזה נומרית'));
    }
    if (courses.find(({ courseName }) => courseName === 'רשתות תקשורת מחשבים')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'רשתות תקשורת מחשבים'));
    }
    if (courses.find(({ courseName }) => courseName === 'אבטחת נתונים')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'אבטחת נתונים'));
    }
    if (courses.find(({ courseName }) => courseName === 'עיבוד תמונה וראייה ממוחשבת')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'עיבוד תמונה וראייה ממוחשבת'));
    }
    if (courses.find(({ courseName }) => courseName === 'בטיחות תוכנה')) {
      arrayToInserttemp.push(courses.find(({ courseName }) => courseName === 'בטיחות תוכנה'));
    }
    for (var i = 0; i < arrayToInserttemp.length; i++) {
      for (var j = 0; j < courses.length; j++) {
        if ((arrayToInserttemp[i]["courseName"] == courses[j]["courseName"]) && (arrayToInserttemp[i]["grade"] < courses[j]["grade"])) {
          arrayToInserttemp[i] = courses[j];
          break;
        }
      }
    }
    courses = arrayToInserttemp;
    return arrayToInserttemp;
  }
  var i = 0;
  var coursesChoice = [];
  courseChoicearray(student.courses, coursesChoice);
  var courseGenral = [];
  courseGeneralarray(student.courses, courseGenral);
  var arrayToInserttemp = [];
  const container = React.useRef(null);
  const pdfExportComponent = React.useRef(null);
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  }
  
  const updateTotalUnitForEachSemester = () => {
    for (let i = 0; i < unitsBySemester.length; i++) {
      if (unitsBySemester[i].yearOfLearning == 'א') {
        if (unitsBySemester[i].semesterOfLearning == 'א') {
          countUnitSemesters = unitsBySemester[i].units
        }
        if (unitsBySemester[i].semesterOfLearning == 'ב') {
          console.log("update");
          var data = {
            yearOfLearning: unitsBySemester[i].yearOfLearning,
            semesterOfLearning: unitsBySemester[i].semesterOfLearning,
            units: unitsBySemester[i].units + countUnitSemesters,
            studentID: params.id
          }
          UnitsBySemesterDataService.updateUnitsBySemester(data)
            .then(response => {
              console.log(response.data);
              console.log("update");
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    }
  }
  const headShapeArrow1 = { svgElem: <path d="M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z" />, offsetForward: 0.25 }
  let navigate = useNavigate()
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);
  const box4Ref = useRef(null);
  const box5Ref = useRef(null);
  const box6Ref = useRef(null);
  const box7Ref = useRef(null);
  const box8Ref = useRef(null);
  const box9Ref = useRef(null);
  const box10Ref = useRef(null);
  const box11Ref = useRef(null);
  const box12Ref = useRef(null);
  const box13Ref = useRef(null);
  
  return (
    //<form onSubmit={deleteCourseByStudentID(params.id)}>
    <div>
      <div className="example-config">
        <button className="btn btn-secondary" onClick={exportPDFWithComponent}>
          Export PDF
        </button>
        &nbsp;      
        <button class="btn btn-secondary" onClick={() => navigate(-1)} >
          Return to previous page
        </button>
      </div>
      <div>
        <PDFExport ref={pdfExportComponent} paperSize="auto" margin={40} fileName={`Report for ${new Date().getFullYear()}`} author="KendoReact Team">
          {student ? (
            <div >
              <h5>{student.name}</h5>
              {(() => {
                if ((student.average < 60) || (student.years === 'ב' && student.totalunits < 36) || ((student.years === 'ג' && student.totalunits < 75)) || ((student.years === 'ד' && student.totalunits < 115))) {
                  return (
                    <p>
                      <div className="col-sm1 text-white bg-secondary w-40 l-20">
                        <strong> ת״ז : </strong>{student.student_id}
                        <strong> | ממוצע : </strong>{student.average}
                        <strong> | שנה : </strong>{student.years}
                        <strong> | נק״ז : </strong>{student.totalunits}
                        <strong> | נק״ז : </strong>{student.valideunits}
                          
                      </div>
                    </p>
                  )
                } else {
                  return (
                    <p>
                      <div className="col-sm1 text-white bg-secondary w-40 l-20">
                        <strong> ת״ז : </strong>{student.student_id}
                        <strong> | ממוצע : </strong>{student.average}
                        <strong> | שנה : </strong>{student.years}
                        <strong> | נק״ז כללי: </strong>{student.totalunits}
                        <strong> | נק״ז עובר: </strong>{student.valideunits}
                        <strong class=" d-block  ml-auto mr-o " > תקין </strong>
                        <Link to={"/students/" + student._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                          View Students
                        </Link>
                        <br />
                      </div>
                    </p>
                  )
                }
              })()
              }
              <div className="card text-center " >
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                </div>
                {
                  student.courses.length > 0 ? (
                    student.courses.map((course, index) => {
                      if ((!student.courses.find(({ courseName }) => courseName === 'חדו"א  - 1')) && (!student.courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה')) && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I')) && (!student.courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'))) {
                        return (
                          <>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חדו"א  - 1<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגברה לינארית לתוכנה-ה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מבוא למדעי המחשב<br />
                                    None <br />
                                    4.5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if (((course.courseName == 'חדו"א  - 1')) && (!student.courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה')) && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I')) && (!student.courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגברה לינארית לתוכנה-ה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מבוא למדעי המחשב<br />
                                    None <br />
                                    4.5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if (((course.courseName == 'חדו"א  - 1')) && (!student.courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה')) && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגברה לינארית לתוכנה-ה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if (((course.courseName == 'חדו"א  - 1')) && (!student.courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה')) && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגברה לינארית לתוכנה-ה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if (((course.courseName == 'חדו"א  - 1')) && (!student.courses.find(({ courseName }) => courseName === 'אלגברה לינארית לתוכנה-ה'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגברה לינארית לתוכנה-ה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'חדו"א  - 1')) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'אלגברה לינארית לתוכנה-ה') && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I')) && (!student.courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " >
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מבוא למדעי המחשב<br />
                                    None <br />
                                    4.5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'אלגברה לינארית לתוכנה-ה') && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'אלגברה לינארית לתוכנה-ה'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " >
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'אלגברה לינארית לתוכנה-ה') && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I'))) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " >
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים I<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'אלגברה לינארית לתוכנה-ה')) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'לוגיקה ונושאים דיסקרטיים I'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " >
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגברה לינארית לתוכנה-ה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'לוגיקה ונושאים דיסקרטיים I') && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I')) && (!student.courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'))) {
                        return (
                          <>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מבוא למדעי המחשב<br />
                                    None <br />
                                    4.5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'לוגיקה ונושאים דיסקרטיים I') && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I'))) {
                        return (
                          <>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'לוגיקה ונושאים דיסקרטיים I')) {
                        return (
                          <>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box3Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'ארכיטקטורת מחשבים I') && (!student.courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'))) {
                        return (
                          <>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מבוא למדעי המחשב<br />
                                    None <br />
                                    4.5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'ארכיטקטורת מחשבים I')) {
                        return (
                          <>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " ref={box2Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else if ((course.courseName == 'מבוא למדעי המחשב')) {
                        if (course.grade > 55) {
                          return (
                            <div className="col-sm text-white "
                              key={course.codeCourses} >
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          );
                        }
                        else {
                          return (
                            <div className="col-sm text-white "
                              key={course.codeCourses} >
                              <div className="card my-3 " ref={box4Ref}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          );
                        }
                      }
                    }
                    )
                  ) : (
                    <div className="col-sm-4">
                      <p>No courses yet.</p>
                    </div>
                  )}
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                  <div>
                  </div>
                </div>
                {student.courses.length > 0 ? (
                  student.courses.map((course, index) => {
                    if ((!student.courses.find(({ courseName }) => courseName === 'חדוא 2 להנדסת תוכנה')) && (!student.courses.find(({ courseName }) => courseName === 'פיסיקה להנדסת תוכנה')) && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים I')) && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים I')) && (!student.courses.find(({ courseName }) => courseName === 'מבוא למדעי המחשב'))) {
                      return (
                        <>
                          <div className="col-sm text-white ">
                            <div className="card my-3 " ref={box1Ref}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  חדוא 2 להנדסת תוכנה<br />
                                  None <br />
                                  5 <br />
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white ">
                            <div className="card my-3 ">
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                פיסיקה להנדסת תוכנה<br />
                                  None <br />
                                  5 <br />
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white " >
                            <div className="card my-3 " >
                              <p className='bg-white text-white text-center'>
                                <h11>
                                  Empty case <br />
                                  <br />
                                  <br />
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white ">
                            <div className="card my-3 " ref={box3Ref}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  לוגיקה ונושאים דיסקרטיים I<br />
                                  None <br />
                                  5 <br />
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white ">
                            <div className="card my-3 " ref={box2Ref}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  ארכיטקטורת מחשבים I<br />
                                  None <br />
                                  4 <br />
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white ">
                            <div className="card my-3 " ref={box4Ref}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  מבוא למדעי המחשב<br />
                                  None <br />
                                  4.5 <br />
                                </h11>
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    }
                    if ((course.courseName == 'חדוא 2 להנדסת תוכנה') && (student.courses.find(({ courseName }) => courseName === 'פיסיקה להנדסת תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white " key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box9Ref}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                              start={box1Ref} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box9Ref}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                              start={box1Ref} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'חדוא 2 להנדסת תוכנה') && (!student.courses.find(({ courseName }) => courseName === 'פיסיקה להנדסת תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'פיסיקה להנדסת תוכנה'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-sucess text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box1Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פיסיקה להנדסת תוכנה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'פיסיקה להנדסת תוכנה'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " ref={box1Ref}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box1Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פיסיקה להנדסת תוכנה<br />
                                    None <br />
                                    5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'פיסיקה להנדסת תוכנה') && (student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים II'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} strokeWidth={3} gridBreak={'10'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box1Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} strokeWidth={3} gridBreak={'10'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box1Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'פיסיקה להנדסת תוכנה') && (!student.courses.find(({ courseName }) => courseName === 'לוגיקה ונושאים דיסקרטיים II'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString()}
                              key={course.codeCourses}>
                              <div className="card my-3 ">
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center' ref={box3Ref} >
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים II<br />
                                    None  <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString()}
                              key={course.codeCourses}>
                              <div className="card my-3 ">
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center' ref={box3Ref} >
                                  <h11>
                                    לוגיקה ונושאים דיסקרטיים II <br />
                                    None  <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'לוגיקה ונושאים דיסקרטיים II') && (student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים II'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box10Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box10Ref}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'לוגיקה ונושאים דיסקרטיים II') && (!student.courses.find(({ courseName }) => courseName === 'ארכיטקטורת מחשבים II'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box10Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים II<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box2Ref} //can be react ref
                                end={'item'}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box10Ref}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ארכיטקטורת מחשבים II<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box2Ref} //can be react ref
                                end={'item'}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'ארכיטקטורת מחשבים II') && (student.courses.find(({ courseName }) => courseName === 'תכנות מונחה עצמים'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box2Ref} //can be react ref
                                end={'item'}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                                start={box2Ref} //can be react ref
                                end={'item'}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'ארכיטקטורת מחשבים II') && (!student.courses.find(({ courseName }) => courseName === 'תכנות מונחה עצמים'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString()}
                              key={course.codeCourses}>
                              <div className="card my-3 ">
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    תכנות מונחה עצמים<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString()}
                              key={course.codeCourses}>
                              <div className="card my-3 ">
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    תכנות מונחה עצמים<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'תכנות מונחה עצמים')) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box5Ref}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'bottom'}
                              start={box4Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box5Ref}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'bottom'}
                              start={box4Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                    }
                  }
                  )
                ) : (
                  <div className="col-sm-4">
                    <p>No courses yet.</p>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                  <div>
                  </div>
                </div>
                {student.courses.length > 0 ? (
                  student.courses.map((course, index) => {
                    if ((course.courseName == 'מבוא להסתברות וסטטיסטיקה') && (student.courses.find(({ courseName }) => courseName === 'יסודות הנדסת תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box8Ref}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box1Ref} //can be react ref
                              end={box8Ref} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box9Ref}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box1Ref} //can be react ref
                              end={box8Ref} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'מבוא להסתברות וסטטיסטיקה') && (!student.courses.find(({ courseName }) => courseName === 'יסודות הנדסת תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box8Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box1Ref} //can be react ref
                                end={box8Ref} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item3'} ref={box6Ref} >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    יסודות הנדסת תוכנה<br />
                                    None <br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow endAnchor={'auto'} startAnchor={'auto'} gridBreak={'-7.5%50'} path={"grid"} strokeWidth={3} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} dashness={{ strokeLen: 50, nonStrokeLen: 15, animation: 2 }}
                                start={box4Ref} //can be react ref
                                end={'item3'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div></>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box8Ref}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box1Ref} //can be react ref
                                end={box8Ref} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item3'} ref={box6Ref} >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    יסודות הנדסת תוכנה<br />
                                    None <br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow endAnchor={'auto'} startAnchor={'auto'} gridBreak={'-7.5%50'} path={"grid"} strokeWidth={3} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} dashness={{ strokeLen: 50, nonStrokeLen: 15, animation: 2 }}
                                start={box4Ref} //can be react ref
                                end={'item3'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div></>
                        );
                      }
                    }
                    else if ((course.courseName == 'יסודות הנדסת תוכנה') && (student.courses.find(({ courseName }) => courseName === 'מבנה נתונים-ה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item3'} ref={box6Ref} >
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow endAnchor={'auto'} startAnchor={'auto'} gridBreak={'-7.5%50'} path={"grid"} strokeWidth={3} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} dashness={{ strokeLen: 50, nonStrokeLen: 15, animation: 2 }}
                                start={box4Ref} //can be react ref
                                end={'item3'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div></>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white " id={(course.codeCourse).toString(student.courses.includes(course.courseName == 'פיסיקה להנדסת תוכנה'))}
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item3'} ref={box6Ref} >
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow endAnchor={'auto'} startAnchor={'auto'} gridBreak={'-7.5%50'} path={"grid"} strokeWidth={3} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} dashness={{ strokeLen: 50, nonStrokeLen: 15, animation: 2 }}
                                start={box4Ref} //can be react ref
                                end={'item3'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " id={(course.codeCourse).toString()}
                              key={course.codeCourses}>
                              <div className="card my-3 ">
                                <p className='bg-success text-white text-center'> ref={box2Ref}
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'מבנה נתונים-ה') && (student.courses.find(({ courseName }) => courseName === 'עקרונות שפות תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box7Ref} >
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} curveness={0} path="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'right'} endAnchor={'left'}
                              start={box3Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                            {<Xarrow strokeWidth={3} curveness={0} path="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'left'} endAnchor={'right'}
                              start={box4Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box7Ref} >
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} curveness={0} path="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'right'} endAnchor={'left'}
                              start={box3Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                            {<Xarrow strokeWidth={3} curveness={0} path="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'left'} endAnchor={'right'}
                              start={box4Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'עקרונות שפות תוכנה')) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} >
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                              start={box5Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} >
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                              start={box5Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                    }
                  }
                  )
                ) : (
                  <div className="col-sm-4">
                    <p>No courses yet.</p>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                  <div>
                  </div>
                </div>
                {student.courses.length > 0 ? (
                  student.courses.map((course, index) => {
                    if ((course.courseName == 'בדיקות ואיכות בהנדסת תוכנה') && (student.courses.find(({ courseName }) => courseName === 'הנדסת דרישות וניתוח תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'right'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box6Ref} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'right'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box6Ref} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'בדיקות ואיכות בהנדסת תוכנה') && (!student.courses.find(({ courseName }) => courseName === 'הנדסת דרישות וניתוח תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'right'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    הנדסת דרישות וניתוח תוכנה<br />
                                    None <br />
                                    3,5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'right'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    הנדסת דרישות וניתוח תוכנה<br />
                                    None <br />
                                    3,5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'הנדסת דרישות וניתוח תוכנה') && (student.courses.find(({ courseName }) => courseName === 'אנגלית מדוברת'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box9Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'הנדסת דרישות וניתוח תוכנה') && (!student.courses.find(({ courseName }) => courseName === 'אנגלית מדוברת'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אנגלית מדוברת <br />
                                    None <br />
                                    2 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="card my-3 ">
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  אנגלית מדוברת <br />
                                  None <br />
                                  2 <br />
                                </h11>
                              </p>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אנגלית מדוברת') && (student.courses.find(({ courseName }) => courseName === 'אוטומטים ושפות פורמאליות'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} >
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} >
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'אנגלית מדוברת') && (!student.courses.find(({ courseName }) => courseName === 'אוטומטים ושפות פורמאליות'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box6Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box11Ref}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אוטומטים ושפות פורמאליות<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box11Ref}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  אוטומטים ושפות פורמאליות<br />
                                  None <br />
                                  4<br />
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box3Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אוטומטים ושפות פורמאליות') && (student.courses.find(({ courseName }) => courseName === 'אלגורתמים I'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box11Ref}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box3Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={box11Ref}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box3Ref} //can be react ref
                              end={(course.codeCourse).toString()}  //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'אוטומטים ושפות פורמאליות') && (!student.courses.find(({ courseName }) => courseName === 'אלגורתמים I'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box11Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגורתמים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box7Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box11Ref}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box3Ref} //can be react ref
                                end={(course.codeCourse).toString()}  //or an id
                              />}
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגורתמים I<br />
                                    None <br />
                                    4 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box7Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אלגורתמים I') && (student.courses.find(({ courseName }) => courseName === 'תכנות מונחה עצמים מתקדם'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box7Ref} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow path={"grid"} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box7Ref} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'אלגורתמים I') && (!student.courses.find(({ courseName }) => courseName === 'תכנות מונחה עצמים מתקדם'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()} ref={box13Ref}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box7Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item4'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    תכנות מונחה עצמים<br />
                                    None<br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'-0.5%5'} startAnchor={'left'} endAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box5Ref} //can be react ref
                                end={'item4'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box7Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item4'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    תכנות מונחה עצמים<br />
                                    None<br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow path={"grid"} gridBreak={'-0.5%5'} startAnchor={'left'} endAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box5Ref} //can be react ref
                                end={'item4'} //or an id
                              />}
                            </div></>
                        );
                      }
                    }
                    else if ((course.courseName == 'תכנות מונחה עצמים מתקדם')) {
                      return (
                        <div className="col-sm text-white "
                          key={course.codeCourses}>
                          <div className="card my-3 " id={(course.codeCourse).toString()} >
                            <p className='bg-success text-white text-center'>
                              <h11>
                                {course.courseName}<br />
                                {course.grade}<br />
                                {course.units}
                              </h11>
                            </p>
                          </div>
                          {<Xarrow path={"grid"} gridBreak={'-0.5%5'} startAnchor={'left'} endAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500} start={box5Ref} //can be react ref
                            end={'item4'} //or an id
                          />}
                        </div>
                      );
                    }
                  }
                  )
                ) : (
                  <div className="col-sm-4">
                    <p>No courses yet.</p>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                  <div>
                  </div>
                </div>
                {student.courses.length > 0 ? (
                  student.courses.map((course, index) => {
                    if ((course.courseName == 'מבוא לתקשורת מחשבים') && (student.courses.find(({ courseName }) => courseName === 'אנליזה נומרית'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={'item9'}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box8Ref} //can be react ref
                              end={'item9'} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={'item9'}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box8Ref} //can be react ref
                              end={'item9'} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'מבוא לתקשורת מחשבים') && (!student.courses.find(({ courseName }) => courseName === 'אנליזה נומרית'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item9'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box8Ref} //can be react ref
                                end={'item9'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אנליזה נומרית<br />
                                    None <br />
                                    3,5 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item9'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} endAnchor={'left'} startAnchor={'left'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box8Ref} //can be react ref
                                end={'item9'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 ">
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אנליזה נומרית<br />
                                    None <br />
                                    3,5 <br />
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אנליזה נומרית') && (student.courses.find(({ courseName }) => courseName === 'בסיסי נתונים'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אנליזה נומרית') && (!student.courses.find(({ courseName }) => courseName === 'בסיסי נתונים'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    בסיסי נתונים<br />
                                    None<br />
                                    6
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    בסיסי נתונים<br />
                                    None<br />
                                    6
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אנליזה נומרית') && (!student.courses.find(({ courseName }) => courseName === 'בסיסי נתונים')) && (coursesChoice.length == 0)) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    בסיסי נתונים<br />
                                    None<br />
                                    6
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    בסיסי נתונים<br />
                                    None<br />
                                    6
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אנליזה נומרית') && (student.courses.find(({ courseName }) => courseName === 'בסיסי נתונים') && (coursesChoice.length != 0))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'בסיסי נתונים') && (coursesChoice.length != 0)) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'בסיסי נתונים') && (coursesChoice.length == 0)) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((coursesChoice.includes(course.courseName)) && (student.courses.find(({ courseName }) => courseName === 'מבוא לקומפילציה'))) {
                      course = coursesChoice.shift();
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((coursesChoice.includes(course)) && (!student.courses.find(({ courseName }) => courseName === 'מבוא לקומפילציה'))) {
                      course = coursesChoice.shift();
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 "  >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item5'} >
                                <p className='bg-secondary text-white text-center' >
                                  <h11>
                                    מבוא לקומפילציה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'-7%35'} endAnchor={'top'} startAnchor={'bottom'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item5'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white " >
                              <div className="card my-3 " >
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    Empty case <br />
                                    <br />
                                    <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item5'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מבוא לקומפילציה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'-7%35'} endAnchor={'top'} startAnchor={'bottom'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item5'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'מבוא לקומפילציה')) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} ref={'item5'}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'-7%35'} endAnchor={'top'} startAnchor={'bottom'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box11Ref} //can be react ref
                              end={'item5'} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()} >
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'-7%35'} endAnchor={'top'} startAnchor={'bottom'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box11Ref} //can be react ref
                              end={'item5'} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                  }
                  )
                ) : (
                  <div className="col-sm-4">
                    <p>No courses yet.</p>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                  <div>
                  </div>
                </div>
                {student.courses.length > 0 ? (
                  student.courses.map((course, index) => {
                    if ((course.courseName == 'רשתות תקשורת מחשבים') && (student.courses.find(({ courseName }) => courseName === 'אבטחת נתונים'))) {
                      if (course.grade > 55) {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-success text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={'item9'} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                      else {
                        return (
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  {course.courseName}<br />
                                  {course.grade}<br />
                                  {course.units}
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={'item9'} //can be react ref
                              end={(course.codeCourse).toString()} //or an id
                            />}
                          </div>
                        );
                      }
                    }
                    else if ((course.courseName == 'רשתות תקשורת מחשבים') && (!student.courses.find(({ courseName }) => courseName === 'אבטחת נתונים'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={'item9'} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " id={"security"}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אבטחת נתונים<br />
                                    None <br />
                                    3,5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'10'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={'item9'} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white ">
                              <div className="card my-3 " id={"security"}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אבטחת נתונים<br />
                                    None <br />
                                    3,5 <br />
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אבטחת נתונים') && (student.courses.find(({ courseName }) => courseName === 'ניהול פרויקט תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אבטחת נתונים') && (!student.courses.find(({ courseName }) => courseName === 'ניהול פרויקט תוכנה') && (coursesChoice.length != 0))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אבטחת נתונים') && (!student.courses.find(({ courseName }) => courseName === 'ניהול פרויקט תוכנה') && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (!student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות ')))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item45'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ניהול פרויקט תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ניהול פרויקט תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'אבטחת נתונים') && (!student.courses.find(({ courseName }) => courseName === 'ניהול פרויקט תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ניהול פרויקט תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'project'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'project'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    ניהול פרויקט תוכנה<br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'ניהול פרויקט תוכנה') && (coursesChoice.length != 0)) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'ניהול פרויקט תוכנה') && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (!student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'ניהול פרויקט תוכנה') && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'ניהול פרויקט תוכנה') && (coursesChoice.length == 0) && (student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((coursesChoice.includes(course.courseName)) && (student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה'))) {
                      course = coursesChoice.shift();
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((coursesChoice.includes(course)) && (!student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (!student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      course = coursesChoice.shift();
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((coursesChoice.includes(course)) && (!student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      course = coursesChoice.shift();
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'מערכות הפעלה') && (!student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    חישוביות סיבוכיות <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'מערכות הפעלה') && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'מערכות הפעלה')) && (student.courses.find(({ courseName }) => courseName === 'חישוביות סיבוכיות '))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={'item66'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} endAnchor={'left'} startAnchor={'right'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box9Ref} //can be react ref
                                end={(course.codeCourse).toString()} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-white text-white text-center'>
                                  <h11>
                                    מערכות הפעלה<br />
                                    None<br />
                                    4,5
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName == 'חישוביות סיבוכיות ')) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item55'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} path={"grid"} gridBreak={'5%'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box11Ref} //can be react ref
                                end={'item55'} //or an id
                              />}
                            </div>
                          </>
                        );
                      }
                    }
                  }
                  )
                ) : (
                  <div className="col-sm-4">
                    <p>No courses yet.</p>
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                  <div>
                  </div>
                </div>
                {student.courses.length > 0 ? (
                  student.courses.map((course, index) => {
                    if ((courseGenral.includes(course.courseName)) && (student.courses.find(({ courseName }) => courseName === 'בטיחות תוכנה'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((!courseGenral.includes(course.courseName)) && (!student.courses.find(({ courseName }) => courseName === 'בטיחות תוכנה')) && (!student.courses.find(({ courseName }) => courseName === 'פרויקט גמר')) && (!student.courses.find(({ courseName }) => courseName === 'סימנר')) && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'אלגורתמים II'))) {
                      return (
                        <>
                          <div className="col-sm text-white "
                          >
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  קורס כללי <br />
                                  None<br />
                                  2
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white "
                          >
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  בטיחות תוכנה <br />
                                  None<br />
                                  3,5
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={'item66'}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  פרויקט גמר <br />
                                  None<br />
                                  8
                                </h11>
                              </p>
                            </div>
                            <div className="card my-3 " id={'item66'}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  סמינר   <br />
                                  None<br />
                                  1
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white "
                          >
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  קורס בחירה<br />
                                  None<br />
                                  5
                                </h11>
                              </p>
                            </div>
                          </div>
                          <div className="col-sm text-white "
                            key={course.codeCourses}>
                            <div className="card my-3 " id={'item6'}>
                              <p className='bg-secondary text-white text-center'>
                                <h11>
                                  אלגורתמים II<br />
                                  None<br />
                                  4
                                </h11>
                              </p>
                            </div>
                            {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={box10Ref} //can be react ref
                              end={'item6'} //or an id
                            />}
                          </div>
                          <div className="col-sm text-white "
                          >
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  קורס בחירה<br />
                                  None<br />
                                  5
                                </h11>
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    }
                    else if ((courseGenral.includes(course.courseName)) && (!student.courses.find(({ courseName }) => courseName === 'בטיחות תוכנה')) && (!student.courses.find(({ courseName }) => courseName === 'פרויקט גמר')) && (!student.courses.find(({ courseName }) => courseName === 'סימנר')) && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'אלגורתמים II'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    בטיחות תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פרויקט גמר <br />
                                    None<br />
                                    8
                                  </h11>
                                </p>
                              </div>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    סמינר   <br />
                                    None<br />
                                    1
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגורתמים II<br />
                                    None<br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    בטיחות תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פרויקט גמר <br />
                                    None<br />
                                    8
                                  </h11>
                                </p>
                              </div>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    סמינר   <br />
                                    None<br />
                                    1
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגורתמים II<br />
                                    None<br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((courseGenral.includes(course.courseName)) && (!student.courses.find(({ courseName }) => courseName === 'בטיחות תוכנה')) && (!student.courses.find(({ courseName }) => courseName === 'פרויקט גמר')) && (!student.courses.find(({ courseName }) => courseName === 'סימנר')) && (coursesChoice.length != 0)) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    בטיחות תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פרויקט גמר <br />
                                    None<br />
                                    8
                                  </h11>
                                </p>
                              </div>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    סמינר   <br />
                                    None<br />
                                    1
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((courseGenral.includes(course.courseName)) && (!student.courses.find(({ courseName }) => courseName === 'בטיחות תוכנה')) && (student.courses.find(({ courseName }) => courseName === 'פרויקט גמר')) && (student.courses.find(({ courseName }) => courseName === 'סימנר'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    בטיחות תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((!courseGenral.includes(course.courseName)) && (i == 0)) {
                      i = i + 1
                      return (
                        <>
                          <div className="col-sm text-white "
                          >
                            <div className="card my-3 " id={(course.codeCourse).toString()}>
                              <p className='bg-danger text-white text-center'>
                                <h11>
                                  קורס כללי <br />
                                  None<br />
                                  2
                                </h11>
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    }
                    else if ((course.courseName === 'בטיחות תוכנה') && (student.courses.find(({ courseName }) => courseName === 'פרויקט גמר')) && (student.courses.find(({ courseName }) => courseName === 'סימנר'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                    else if ((course.courseName === 'בטיחות תוכנה') && (!student.courses.find(({ courseName }) => courseName === 'פרויקט גמר')) && (!student.courses.find(({ courseName }) => courseName === 'סימנר')) && (coursesChoice.length == 0) && (!student.courses.find(({ courseName }) => courseName === 'אלגורתמים II'))) {
                      if (course.grade > 55) {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item46'}>
                                <p className='bg-success text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.6%5'} path={"grid"} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={'item45'} //can be react ref
                                end={'item46'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פרויקט גמר <br />
                                    None<br />
                                    8
                                  </h11>
                                </p>
                              </div>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    סמינר   <br />
                                    None<br />
                                    1
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגורתמים II<br />
                                    None<br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                      else {
                        return (
                          <>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    {course.courseName}<br />
                                    {course.grade}<br />
                                    {course.units}
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    בטיחות תוכנה <br />
                                    None<br />
                                    3,5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    פרויקט גמר <br />
                                    None<br />
                                    8
                                  </h11>
                                </p>
                              </div>
                              <div className="card my-3 " id={'item66'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    סמינר   <br />
                                    None<br />
                                    1
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                            <div className="col-sm text-white "
                              key={course.codeCourses}>
                              <div className="card my-3 " id={'item6'}>
                                <p className='bg-secondary text-white text-center'>
                                  <h11>
                                    אלגורתמים II<br />
                                    None<br />
                                    4
                                  </h11>
                                </p>
                              </div>
                              {<Xarrow strokeWidth={3} gridBreak={'-0.5%18'} path={"grid"} endAnchor={'right'} startAnchor={'left'} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                                start={box10Ref} //can be react ref
                                end={'item6'} //or an id
                              />}
                            </div>
                            <div className="col-sm text-white "
                            >
                              <div className="card my-3 " id={(course.codeCourse).toString()}>
                                <p className='bg-danger text-white text-center'>
                                  <h11>
                                    קורס בחירה<br />
                                    None<br />
                                    5
                                  </h11>
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      }
                    }
                  }
                  )
                ) : (
                  <div className="col-sm-4">
                    <p>No courses yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <br />
              <p>No student selected.</p>
            </div>
          )}
        </PDFExport>
      </div>
    </div>
  );
};
export default StudentVisual;
