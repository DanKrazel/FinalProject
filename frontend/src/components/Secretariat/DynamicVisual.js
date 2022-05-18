import React, { useState, useEffect, useRef } from "react";
import StudentDataService from "../../services/studentService";
import UnitsBySemesterDataService from "../../services/unitsBySemesterService";
import { useParams, useNavigate } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Link } from "react-router-dom";
import "../../App.css";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { ReactComponent as HeadSvg } from "../../assets/arrowHead-resize.svg";
import DependenciesDataService from "../../services/dependencieService"
import CourseDataService from "../../services/courseService"
import CourseDetailsDataService from "../../services/courseDetailsService"
import UserDataService from "../../services/userService";
import html2canvas from "html2canvas"



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
  const [content, setContent] = useState("");
  const [dependencies, setDependencies] = useState([]);
  const [student, setStudent] = useState(initialStudentState);
  const [coursesDetails, setCoursesDetails] = useState([])
  const [unitsBySemester, setUnitsBySemester] = useState([])
  const [semesters, setSemesters] = useState([])
  const [years, setYears] = useState([])
  var countUnitSemesters = 0;
  const pdfExportComponent = React.useRef(null);

  useEffect(() => {
    retrieveContent();
    retrieveCoursesDetails();
    console.log("useEffect student")
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

  const retrieveContent = () => {
    UserDataService.getSecretariatBoard()
      .then(response => {
      console.log("response",response)
      //setContent(response.data)
      })
      .catch(error => {
        console.log("errooor",error)
        setContent((error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString())
    });  
  }

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(responseStudent => {
        CourseDataService.getCoursesDetailsByCodeCourse(responseStudent.data.name)
          .then(responseDetails => {
            responseStudent.data.courses = responseDetails.data
            console.log('responseStudent.data', responseStudent.data)
            console.log(responseDetails.data)
            setStudent(responseStudent.data);
            retrieveDependencies();
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
        console.log("a",response.data.dependencies.map(function (a) { return a.StartCoursesname; }))
        console.log("b")
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

  const exportImage = (id) => {
    html2canvas(document.querySelector(id), {allowTaint: true})
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

  const retrieveCoursesDetails = () => {
    CourseDetailsDataService.getAll()
      .then(response => {
        getStudent(params.id);
        console.log("responseDetails", response.data.coursesDetails)
        setCoursesDetails(response.data.coursesDetails)
        setSemesters(uniqBy(response.data.coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
        setYears(uniqBy(response.data.coursesDetails.map(function (a) { return a.yearOfLearning; }), JSON.stringify))
        console.log("semesters response",uniqBy(response.data.coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
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

  // var startf = useRef(null);
  // var endf = useRef(null);
  // let semesters = uniqBy(coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify);
  // let years = uniqBy(coursesDetails.map(function (a) { return a.yearOfLearning; }), JSON.stringify);
  // startf = (dependencies.map(function (a) { return a.StartCoursesname; }));
  // endf = (dependencies.map(function (a) { return a.EndCoursesname; }));
  // let zipped = startf.map((x, i) => [x, endf[i]]);
  let navigate = useNavigate()
  //console.log("zipped", zipped)



  return (
    <div>
        {!content ? (
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
        <Link to={"/students/" + student._id} className="btn btn-secondary">
            View Students
        </Link>
      </div>
      <div id="capture">
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
                        <strong> | נק״ז עובר: </strong>{student.valideunits}
                        <strong class=" d-block  ml-auto mr-o " > תקין </strong>
                        <br />
                      </div>
                    </p>
                  )
                }
              })()
              }
              <>
                {dependencies.map((dependency, index) => {
                  return (
                    <div >
                      {
                        <Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                          start={dependency.StartCoursesname.toString()}  //can be react ref
                          end={dependency.EndCoursesname.toString()} //or an id
                        />
                      }
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
                                        <div className="card my-3 " id={(course.courseName).toString()} >
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
                                  if (f.grade > 55) {
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
                                  else if (f.grade > 1) {
                                    return (
                                      <div className="col-sm text-white "
                                        key={course.codeCourses}>
                                        <div className="card my-3 " id={(f.courseName).toString()}>
                                          <p className='bg-danger text-white text-center'>
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
                                  else {
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

      </div>
    </div>
    ):(
      <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  )}
  </div>
  );
};
export default DynamicVisual;

