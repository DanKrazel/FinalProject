import React, { useState, useEffect, useRef } from "react";
import StudentDataService from "../../services/studentService";
import UnitsBySemesterDataService from "../../services/unitsBySemesterService";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../../App.css";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { ReactComponent as HeadSvg } from "../../assets/arrowHead-resize.svg";
import DependenciesDataService from "../../services/dependencieService"
import CourseDataService from "../../services/courseService"
import CourseDetailsDataService from "../../services/courseDetailsService"
import UserDataService from "../../services/userService";
import html2canvas from "html2canvas"
import { set } from "react-hook-form";

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
  useEffect(() => {
    retrieveContent();
    retrieveCoursesDetails();
    console.log("useEffect student")
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
         //   setGetunitsSemest(student.courses, semesters, years)   
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
  /// for make matrix visual , dont delete
  function findIndex(matrix,k,arr){
    console.log(matrix)
    var index ;
    for(var i =0 ; i<matrix[0].length;i++){
      if(matrix[k][i]==arr){
        index = matrix[k][i];
      }
    }
    console.log(index)
    return index
  }
  function guiveIndex(course, semester, year) {
    var maxcourse = [];
    var index =[];
    for (var i = 0; i < year.length; i++) {
      for (var j = 0; j < semester.length; j++) {
        var YearSem=[years[i],semesters[j]]
        var maxcourseTemps = 0
        for (var k = 0; k < course.length; k++) {
          if ((course[k].semesterOfLearning == semester[j]) && (course[k].yearOfLearning == year[i])) {
            maxcourseTemps++;
          }
        }
        maxcourse.push([[years[i].toString()+ semesters[j].toString()],(maxcourseTemps)])
      }
    }
    console.log(maxcourse)
      for (var i = 0; i < years.length; i++) {
        for (var j = 0; j < semesters.length; j++) {
          for (var k = 0; k < course.length; k++) {
            if ((course[k].semesterOfLearning == semester[j]) && (course[k].yearOfLearning == year[i])) {
              const indice = maxcourse[year[i], semester[j]];
              console.log(indice)
            }
          }


        }
      }
    
  }



  function getelement(course, coursesDetails) {
    for (var i = 0; i, coursesDetails.length; i++) {
      if (course['courseName'] == coursesDetails[i]['courseName']) {
        return coursesDetails[i].courseName
      }
    }
  }

////////// end dont delete

function setGetunitsSemest(courses,years,semesters){
    var unites=[];
    var sub_array = [];
    var totalunit = 0;
    years.map((year, index) => {
      semesters.map((semester, index2) => {
        var valideunit = 0;
        for (var i = 0; i < courses.length; i++) {
          var te = courses[i]
          var result = coursesDetails.find(course => course.courseName === courses[i].courseName)
          if (typeof(result) !== 'undefined' ){  
            if (courses[i].semesterOfLearning == semester && year == result.yearOfLearning && !sub_array.find(course => course == result.courseName)) {
              sub_array.push(result.courseName);
              totalunit = totalunit + courses[i].units
              if (courses[i].grade > 55) { 
                valideunit = valideunit + courses[i].units
              }
            }
          }
        }   
        unites.push([[year, semester], [totalunit, valideunit]])
        console.log(unites)
      })      
    })
    return unites  
  }
///  GetUnits(student.courses)

  //guiveIndex(coursesDetails,semesters,years)

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




  function uniqBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }
  var counter = 0 ; 
  let navigate = useNavigate()
  return (
    <div>
        {!content ? (
    <div>
      <div className="example-config">
        <button className="btn btn-secondary" onClick={() => exportImage("#capture")}>
          להוריד תמונה
        </button>
        &nbsp;
        <button class="btn btn-secondary" onClick={() => navigate(-1)} >
          לחזור לדף הקודם
        </button>
        &nbsp;
        {/* <Link to={"/students/" + student._id} className="btn btn-secondary">
            View Students
        </Link> */}
      </div>
      <div >
          {student ? (
            <div id="capture">
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
                {
                years.map((year, index) => {
                  const GetunitsSemest = setGetunitsSemest(student.courses,years,semesters)
                  console.log(GetunitsSemest)
                  return (
                    <>
                      <div className="row">
                        {semesters.map((semester, index3) => {
                          var inccounter = counter 
                          counter = counter +1 
                          return (                           
                            <div className="row">
                              <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
                                {semester}<br/>   
                                {GetunitsSemest[inccounter][0]}  <br />   
                                {GetunitsSemest[inccounter][1][1] + "/ " + GetunitsSemest[inccounter][1][0]}                                
                              </div>
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
                                          <p className='bg-secondary text-white text-center'>
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

