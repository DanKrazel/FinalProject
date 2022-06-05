import React, { useState, useEffect, useRef} from "react";
import StudentDataService from "../../services/studentService";
import CourseDataService  from "../../services/courseService";
import UnitsBySemesterDataService from "../../services/unitsBySemesterService";
import CourseDetailsDataService from "../../services/courseDetailsService"
import UserDataService from "../../services/userService"
import { useParams, useNavigate  } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import "../../App.css";
import * as arrowLine from 'arrow-line';
import styles from "../../index.css"
//import getCoordinate from "./../getCoordinate.js";
import Xarrow from "react-xarrows";
import emailjs from '@emailjs/browser';
import html2canvas from "html2canvas"
import DependenciesDataService from "../../services/dependencieService"
import ImageVisualizationDataService from "../../services/imageVisualizationService";
import { ReactComponent as HeadSvg } from "../../assets/arrowHead-resize.svg";





const StudentSendProf = props => {
  const params = useParams();
  var countUnitSemesters = 0
  var countUnitSemester2 = 0;
  
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

  const initialProfessorState = {
    _id: "",
    user_id:"",
    username: "",
    mail: "",
    role:"",
  };


  const initialUserState = {
    _id: "",
    user_id:"",
    username: "",
    mail: "",
    role:"",
  };



  

  const rootStyle = { display: 'flex', justifyContent: 'center' };
  const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between' };
  const boxStyle = { padding: '10px', border: '1px solid black' };
  const [student, setStudent] = useState(initialStudentState);
  const [unitsBySemester, setUnitsBySemester] = useState([])
  const [professor, setProfessor] = useState(initialProfessorState)
  const [image, setImage] = useState()
  const [user, setUser] = useState(initialUserState)
  const [imageVisualization, setImageVizualisation] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);
  const componentRef = useRef();
  const ImageInput = React.createRef();
  const [dependencies, setDependencies] = useState([]);
  const [coursesDetails, setCoursesDetails] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);
  const [content, setContent] = useState("");





  
  useEffect(() => {
    retrieveContent();
    retrieveCoursesDetails();
    retrieveImageVisualisation();
    //updateTotalUnitForEachSemester();
  }, [refreshKey]);


  const retrieveContent = () => {
    UserDataService.getSecretariatBoard()
      .then(response => {
        console.log("response", response)
      })
      .catch(error => {
        console.log("errooor", error)
        setContent((error.response &&
          error.response.data &&
          error.response.data.message) ||
          error.message ||
          error.toString())
      });
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

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(responseStudent => {
        CourseDataService.getCoursesDetailsByCodeCourse(responseStudent.data.name)
          .then(responseDetails => {
            responseStudent.data.courses = responseDetails.data
            setStudent(responseStudent.data);
            console.log("responseStudent", responseStudent.data)
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


  
  function uniqBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }


  const findProfessor = () => {
    UserDataService.find(params.professorID,"_id")
    .then(response => {
      console.log("response user", response.data);
      setProfessor(response.data.users[0]); 
    })
    .catch(e => {
      console.log(e);
    });
  };


  const retrieveCoursesDetails = () => {
    CourseDetailsDataService.getAll()
      .then(response => {
        console.log("params.id", params.studentID)
        getStudent(params.studentID);
        console.log("responseDetails", response.data.coursesDetails)
        console.log("years response", uniqBy(response.data.coursesDetails.map(function (a) { return a.yearOfLearning; }), JSON.stringify))
        console.log("semesters response", uniqBy(response.data.coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
        setCoursesDetails(response.data.coursesDetails)
        setYears(uniqBy(response.data.coursesDetails.map(function (a) { return a.yearOfLearning; }), JSON.stringify))
        setSemesters(uniqBy(response.data.coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
        console.log("test1")
        findProfessor()
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
      })
      .catch(e => {
        console.log(e);
      });
  };

  function giveIndex(course, semester, year) {
    var maxcourse = [];
    for (var i = 0; i < year.length; i++) {
      for (var j = 0; j < semester.length; j++) {
        var YearSem = [years[i], semesters[j]]
        var maxcourseTemps = 0
        for (var k = 0; k < course.length; k++) {
          if ((course[k].semesterOfLearning == semester[j]) && (course[k].yearOfLearning == year[i])) {
            maxcourseTemps++;
          }
        }
        maxcourse.push([[years[i].toString() + semesters[j].toString()], (maxcourseTemps)])
      }
    }
  //  console.log(maxcourse)
    var index = [];
    var semtemp = 0 ;
    for (var i = 0; i < years.length; i++) {
      for (var j = 0; j < semesters.length; j++) {
        var counter = 0;
        semtemp = semtemp + 1
        for (var k = 0; k < course.length; k++) {
          if ((course[k].semesterOfLearning == semester[j]) && (course[k].yearOfLearning == year[i])) {
            index.push([course[k].courseName, [semtemp,counter]])
            counter = counter + 1            
          }
        }
      }
    }
    //console.log(index)
    return index
  }

  function setGetunitsSemest(courses, years, semesters) {
    var unites = [];
    var sub_array = [];
    var totalunit = 0;
    years.map((year, index) => {
      semesters.map((semester, index2) => {
        var valideunit = 0;
        for (var i = 0; i < courses.length; i++) {
          var te = courses[i]
          var result = coursesDetails.find(course => course.courseName === courses[i].courseName)
          if (typeof (result) !== 'undefined') {
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
      })
    })
    return unites
  }

  function getCoursesMax(course) {
    var f = course
    for (var i = 0; i < student.courses.length; i++) {
      if (course.courseName == student.courses[i].courseName && course.grade < student.courses[i].grade) {
        f = student.courses[i]
      }
    }
    return f
  }

  var counter = 0;

  const ComponentToPrint = React.forwardRef((props, ref) => (
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
                    const indexArrow = giveIndex(coursesDetails, semesters, years);
                   // console.log(dependency.StartCoursesname, dependency.EndCoursesname)
                    var start = indexArrow.find(course => course[0] === dependency.StartCoursesname.toString())
                    var end = indexArrow.find(course => course[0] === dependency.EndCoursesname.toString())
                    var rowI = end[1][0] - start[1][0]
                    var colI = end[1][1] - start[1][1]
                   // console.log(rowI, colI)
                    if (colI==0 && rowI>1 ){
                   //  console.log(rowI)
                     return (
                       <div key={dependency._id}>
                         {
                           <Xarrow path={"grid"} gridBreak={'5'} endAnchor={'left'} startAnchor={'left'} strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                             start={dependency.StartCoursesname.toString()}  //can be react ref
                             end={dependency.EndCoursesname.toString()} //or an id
                           />
                         }
                       </div>
                     );
                   }
                    else if (colI > 0 && rowI > 1) {
                   //   console.log(rowI)
                      return (
                        <div key={dependency._id}>
                          {
                            < Xarrow strokeWidth={3} curveness={0} gridBreak={'5'} path="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'right'} endAnchor={'top'}
                              start={dependency.StartCoursesname.toString()}  //can be react ref
                              end={dependency.EndCoursesname.toString()} //or an id
                            />
                          }
                        </div>
                      );
                    }
                    else if (colI == 1  && rowI == 1) {
                   //   console.log(rowI)
                      return (
                        <div key={dependency._id}>
                          {
                            < Xarrow path={"grid"} strokeWidth={3} gridBreak={'10'} endAnchor={'left'} startAnchor={'right'} showTail headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} tailShape={{ offsetForward: 1 }} _extendSVGcanvas={500}
                              start={dependency.StartCoursesname.toString()}  //can be react ref
                              end={dependency.EndCoursesname.toString()} //or an id
                            />
                          }
                        </div>
                      );
                    }
                    else if ((colI > 1 || colI < -1)  && rowI > 1) {
                      console.log(rowI)
                      return (
                        <div key={dependency._id}>
                          {
                            < Xarrow strokeWidth={3} curveness={0} gridBreak={'%100-0,5'} dashness={{ strokeLen: 10, nonStrokeLen: 15, animation: -2 }} epath="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'bottom'} endAnchor={'top'}
                              start={dependency.StartCoursesname.toString()}  //can be react ref
                              end={dependency.EndCoursesname.toString()} //or an id
                            />
                          }
                        </div>
                      );
                    }
                    else if ((colI > 1 || colI < -1) && rowI == 1) {
                   //   console.log(rowI)
                      return (
                        <div key={dependency._id}>
                          {
                            < Xarrow strokeWidth={3} curveness={0} gridBreak={'5'} path="grid" headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }} startAnchor={'bottom'} endAnchor={'top'}
                              start={dependency.StartCoursesname.toString()}  //can be react ref
                              end={dependency.EndCoursesname.toString()} //or an id
                            />
                          }
                        </div>
                      );
                    }
                  
                   else{
                     return (
                       <div key={dependency._id}>
                         {
                           <Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                             start={dependency.StartCoursesname.toString()}  //can be react ref
                             end={dependency.EndCoursesname.toString()} //or an id
                           />
                         }
                       </div>
                     );
                   }
                  
                  })}
                  {
                    years.map((year, index) => {
                      const GetunitsSemest = setGetunitsSemest(student.courses, years, semesters)
                      return (
                        <>
                          <div className="row">
                            {semesters.map((semester, index3) => {
                              var inccounter = counter
                              counter = counter + 1
                              return (
                                <div className="row">
                                  <div className="col-sm  rounded-round   my-auto  text-center  bg-primary text-white ">
                                    {semester}<br />
                                    {GetunitsSemest[inccounter][1][1] + "/ " + GetunitsSemest[inccounter][1][0]}
                                  </div>
                                  {coursesDetails.map((course, index2) => {
                                    const g = student.courses.find(({ courseName }) => courseName === course.courseName)
                                    if ((!g) && (course.yearOfLearning == year) && (course.semesterOfLearning == semester)) {
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
                                    else if ((course.yearOfLearning == year) && g && course.semesterOfLearning == semester) {
                                      const f = getCoursesMax(g)
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
                                      else if (f.grade > 1 && f.grade < 55) {
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
                                              <p className='bg-warning text-white text-center'>
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

  ));

  let navigate = useNavigate()
  const box1Ref = useRef(null);
  const onImageChange = event => {
    setImage(event.target.files[0]);
  };

  
    
  const htmlToCanvas = (id) => {
    const formData = new FormData();
    html2canvas(document.querySelector(id))
    .then(canvas => {
      //document.body.appendChild(canvas)
      const data = canvas.toDataURL('jpeg')
      data = data.replace('data:' + 'jpeg' + ';base64,', '');
      setImage(data)
      console.log('image', canvas)
      console.log('image', data)
    })
  }

  const exportImage = (id) => {
    html2canvas(document.querySelector(id), {allowTaint: true})
    .then(canvas => {
      //document.body.appendChild(canvas)
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "html_image.jpg";
      link.href = canvas.toDataURL();
      link.target = '_blank';
      link.click();
    })
  }

  const retrieveImageVisualisation = () => {
    ImageVisualizationDataService.getAll()
        .then(response => {
          console.log("ImageVisualization",response.data);
          setImageVizualisation(response.data.imageVisualization); 
          //console.log("requests",requests )
        })
        .catch(e => {
          console.log(e);
        });
    };

  const handlePostCanvas = (id) => {
    //url, name, fn, 
    //var data = canvas.toDataURL(type);
    //e.preventDefault();
    const formData = new FormData()
    html2canvas(document.querySelector(id), {allowTaint: true})
    .then(canvas => {
      //document.body.appendChild(canvas)
      var link = document.createElement("a");
      link.download = "html_image.jpg";
      link.href = canvas.toDataURL();
      var image = canvas.toDataURL("image/jpeg");

      //image = image.substring(image.indexOf(",") + 1)
      //var decode = decodeFileBase64(image)
      

      formData.append('file', image)
      //data = data.replace('data:' + 'jpeg' + ';base64,', '');
      // setImage(data)
      // //console.log('image', canvas)
      // console.log('image', data)
      var data = {
        sender: props.user.username,
        receiver: professor.username,
        imagePath: image,
        studentID: student._id
      }
      ImageVisualizationDataService.postImageVisualization(data)
      .then(response => {
        console.log(response)
        setRefreshKey(oldKey => oldKey +1)
      })
      .catch(e => {
        console.log("error", e);
      });
    
    })

    const decodeFileBase64 = (base64String) => {
      // From Bytestream to Percent-encoding to Original string
      return decodeURIComponent(
        atob(base64String)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    };
  }

  const renderButtonsSentOrView = () => {
    let content = <button type="button" ref={ImageInput} onClick={() => handlePostCanvas("#capture")} className="btn btn-secondary">
    {professor.username} שלח צפייה ל 
  </button>  
    for(let i = 0; i<imageVisualization.length; i++){
      if(imageVisualization[i].studentID == student._id ){
          content = <div className="btn btn-success">
              ! צפייה נשלח 
            </div>
        break;
      }
    }
    return content;
  }


  return (
    //<form onSubmit={deleteCourseByStudentID(params.id)}>
    <div>
    {!content ? (
    <React.Fragment>
    <div>
      <div className="example-config">
        <button className="btn btn-secondary " 
        onChange = {onImageChange}
        onClick={() => exportImage("#capture")} >
         להוריד תמונה
        </button>
      &nbsp;
      {renderButtonsSentOrView()}
      &nbsp;
      <button class="btn btn-secondary " onClick={() => navigate(-1)} >
         לחזור לדף הקודם 
      </button>
      </div>
      </div>
      <ComponentToPrint ref={componentRef} />
    </React.Fragment>
    ) : (
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
            </header>
      </div>
          )}
    </div>

  );
};

export default StudentSendProf;

