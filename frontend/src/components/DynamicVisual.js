import React, { useState, useEffect, useRef } from "react";
import StudentDataService from "../services/studentService";
import UnitsBySemesterDataService from "../services/unitsBySemesterService";
import { useParams, useNavigate } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Link } from "react-router-dom";
import "../App.css";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { ReactComponent as HeadSvg } from "../assets/arrowHead-resize.svg";
import DependenciesDataService from "../services/dependencieService"
import CourseDataService from "../services/courseService"
import CourseDetailsDataService from "../services/courseDetailsService"

const DynamicVisual = props => {
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
  const params = useParams();
  const [dependencies, setDependencies] = useState([]);
  const [student, setStudent] = useState(initialStudentState);
  const [coursesDetails, setCoursesDetails] = useState([])
  const [unitsBySemester, setUnitsBySemester] = useState([])
  var countUnitSemesters = 0;
  const pdfExportComponent = React.useRef(null);

  useEffect(() => {
    retrieveDependencies();
    retrieveCoursesDetails();
    console.log("useEffect student")
    getStudent(params.id);
    getUnitsBySemester(params.id);
    updateTotalUnitForEachSemester();
  }, []);
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
  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(responseStudent => {
        CourseDataService.getCoursesDetailsByCodeCourse(responseStudent.data.name).then(responseDetails => {
          responseStudent.data.courses = responseDetails.data
          console.log('responseStudent.data', responseStudent.data)
          setStudent(responseStudent.data);
        })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log(e);
      });
  };
  const retrieveDependencies = () => {
    DependenciesDataService.getAll()
      .then(response => {
        console.log("responseDependencies", response.data);
        setDependencies(response.data.dependencies);
        console.log("Dependency", dependencies);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  }
  const retrieveCoursesDetails = () => {
    CourseDetailsDataService.getAll()
      .then(response => {
        console.log("responseDetails", response.data.coursesDetails)
        setCoursesDetails(response.data.coursesDetails)
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
  function uniqBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }
  let semesters = uniqBy(coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify);
  let years = uniqBy(coursesDetails.map(function (a) { return a.yearOfLearning; }), JSON.stringify);
  const startf = (dependencies.map(function (a) { return a.StartCoursesname; }));
  const endf = (dependencies.map(function (a) { return a.EndCoursesname; }));
  let zipped = startf.map((x, i) => [x, endf[i]]);
  let navigate = useNavigate()
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
              <>     
                {zipped.map((dependency, index) => {
                  return (
                    <div className="col-lg-4 pb-1">
                      <div className="card">
                        {
                          <Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                            start={dependency[0].toString()}  //can be react ref
                            end={dependency[1].toString()} //or an id
                          />
                        }
                      </div>
                    </div>
                  );
                })}      
                {years.map((year, index) => {
                  return (
                    <>
                      <div className="row">
                        {semesters.map((semester, index3) => {
                          return (
                            <div className="row">
                              {coursesDetails.map((course, index2) => {
                                const f = student.courses.find(({ courseName }) => courseName === course.courseName)
                                if ((!f) && (course.yearOfLearning == year) && (course.semesterOfLearning == semester)) {
                                  return (
                                    <>
                                      <div className="col-sm text-white "
                                        key={course.codeCourses}>
                                        <div className="card my-3 " id={(course.courseName).toString()}>
                                          <p className='bg-secondary text-white text-center'>
                                            <h11>
                                              {course.courseName}<br />
                                              {course.units}
                                            </h11>
                                          </p>
                                        </div>
                                      </div>
                                    </>

                                  );
                                }
                                else if ((course.yearOfLearning == year) && f && f.semesterOfLearning == semester) {
                                  return (
                                      <div className="col-sm text-white "
                                        key={course.codeCourses}>
                                        <div className="card my-3 " id={(f.courseName).toString()}>
                                          <p className='bg-success text-white text-center'>
                                            <h11>
                                              {f.courseName}<br />
                                              {f.grade}<br />
                                              {f.units}
                                            </h11>
                                          </p>
                                        </div>
                                      </div>
                                  );

                                }
                                
                              })
                              }
                            </div>
                          );

                        })}
                      </div>
                    </>
                  );
                })}               
              </>
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
export default DynamicVisual;

