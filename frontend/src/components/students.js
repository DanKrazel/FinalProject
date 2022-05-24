import React, { useState, useEffect, useRef } from "react";
import StudentDataService from "../services/studentService";
import UnitsBySemesterDataService from "../services/unitsBySemesterService";
import { useParams, useNavigate } from "react-router-dom";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import "../App.css";
import Xarrow from "react-xarrows";
import html2canvas from "html2canvas"
import { Link } from "react-router-dom";

const Student = props => {

  const params = useParams();
  var countUnitSemesters = 0
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
  const [student, setStudent] = useState(initialStudentState);
  const [semesters, setSemesters] = useState([])
  const [unitsBySemester, setUnitsBySemester] = useState([])
  useEffect(() => {
    console.log("useEffect student")
    getStudent(params.id);
    getUnitsBySemester(params.id);
    updateTotalUnitForEachSemester();
  }, []);


  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
        StudentDataService.getCoursesByStudentName(response.data.name).then(response => {
          console.log('response.data', response.data)
          setSemesters(uniqBy(response.data.courses.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
          console.log(semesters)
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
  // const countUnitForEachSemester = () => {
  //   console.log("countCourses", countCourses)
  //   //for(let i=0 ;i<student.courses.length ;i++ ){
  //   //console.log(student.courses)
  //   if(student.courses[countCourses].yearOfLearning == "א"){
  //     if(student.courses[countCourses].semesterOfLearning == "א"){
  //       //console.log("countUnitSemester1",countUnitSemester1)
  //       countUnitSemester2 = countUnitSemester1 + student.courses[countCourses].units
  //       //setCountUnitSemester1(countUnitSemester2)
  //       console.log("countUnitSemester2",countUnitSemester2)
  //       console.log("countUnitSemester1",countUnitSemester1)
  //       setCountUnitSemester1(countUnitSemester2)
  //       //console.log("student.unit",student.units)
  //       //countUnitSemesters.current = countUnitSemester2
  //       setCountCourses(countCourses => countCourses +1)
  //       }
  //     } 
  //   //}
  //   return countUnitSemester1;
  // } 
  // function getCoordinate(id) {
  //   const element = document.querySelector('col-sm');
  //   const rect = element.getBoundingClientRect(); 
  //   /*document.getElementById("demo1").innerHTML =
  //   "Left: " + rect.left.toFixed() + ", Top: " + rect.top.toFixed() + ", Width: " + rect.width + ", Height: " + rect.height;*/
  //   console.log(rect);
  //   return rect;
  //   }
  // function checkRef(){
  //   console.log(countUnitSemesters.current)
  // }
  let navigate = useNavigate()
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const exportImage = (id) => {
    html2canvas(document.querySelector(id), { allowTaint: true })
      .then(canvas => {
        //document.body.appendChild(canvas)
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "exportVisualisation.jpg";
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();
      })
  }
  function uniqBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }

  return (
    //<form onSubmit={deleteCourseByStudentID(params.id)}>
    <div>
      <div className="example-config">
        <button className="btn btn-secondary" onClick={() => exportImage("#capture")}>
          Export Image
        </button>
        &nbsp;
        <button class="btn btn-secondary" onClick={() => navigate(-1)} >
          Return to previous page
        </button>
        &nbsp;
      </div>
      <div >
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
                        <button class=" d-block  ml-auto" onClick={() => navigate(-1)} >         חריגה </button> <br />
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
                        <br />
                      </div>
                    </p>
                  )
                }
              })()
              }

                    <div className="row">
                      {semesters.map((semester, index3) => {
                        return (
                          <div className="row">
                            <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                              {semester}
                              </div>
                            {student.courses.map((course, index2) => {
                              if (course.semesterOfLearning == semester) {
                                if (course.grade > 55 && course.grade != null) {
                                  return (
                                    <>
                                      <div className="col-sm text-white "
                                        key={course.codeCourses}>
                                        <div className="card my-3 " id={(course.courseName).toString()} >
                                          <p className='bg-success text-white text-center'>
                                            <h11>
                                              {course.courseName}<br />
                                              {course.units}<br />
                                              {course.grade}
                                            </h11>
                                          </p>
                                        </div>
                                      </div>
                                    </>


                                  );
                                }
                                else if (course.grade<56 && course.grade!= null){
                                  return (
                                    <>
                                      <div className="col-sm text-white "
                                        key={course.codeCourses}>
                                        <div className="card my-3 " id={(course.courseName).toString()} >
                                          <p className='bg-danger text-white text-center'>
                                            <h11>
                                              {course.courseName}<br />
                                              {course.units}<br />
                                              {course.grade}
                                            </h11>
                                          </p>
                                        </div>
                                      </div>
                                    </>


                                  );
                                }
                                else if (course.grade == null ) {
                                  return (
                                    <>
                                      <div className="col-sm text-white "
                                        key={course.codeCourses}>
                                        <div className="card my-3 " id={(course.courseName).toString()} >
                                          <p className='bg-secondary text-white text-center'>
                                            <h11>
                                              {course.courseName}<br />
                                              {course.units}<br />
                                              {course.grade}
                                            </h11>
                                          </p>
                                        </div>
                                      </div>
                                    </>


                                  );
                                }
                               
                              }
                             

                            })

                            }
                          </div>
                        );

                      })}
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
export default Student;
