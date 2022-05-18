import React, { useState, useEffect, useRef} from "react";
import StudentDataService from "../../services/studentService";
import CourseDataService  from "../../services/courseService";
import UnitsBySemesterDataService from "../../services/unitsBySemesterService";
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
import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG
} from "react-component-export-image";
import html2canvas from "html2canvas"
import ImageVisualizationDataService from "../../services/imageVisualizationService";





const StudentSendProf = props => {
  const params = useParams();
  var countUnitSemesters = 0
  var countUnitSemester2 = 0;
  console.log(params.studentID)
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
  //const [refreshKey, setRefreshKey] = useState(0);
  const [unitsBySemester, setUnitsBySemester] = useState([])
  const [professor, setProfessor] = useState(initialProfessorState)
  const [image, setImage] = useState()
  const [user, setUser] = useState(initialUserState)
  const [imageVisualization, setImageVizualisation] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);
  const componentRef = useRef();
  const ImageInput = React.createRef();
  const [dependencies, setDependencies] = useState([]);




  
  useEffect(() => {
    retrieveDependencies();
    getStudent(params.studentID);
    getUnitsBySemester(params.studentID);
    updateTotalUnitForEachSemester();
    findProfessor();
    retrieveImageVisualisation();
  }, [refreshKey]);

  function sleep(time){
      return new Promise((resolve)=>setTimeout(resolve,time)
    )
  }

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
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
        console.log("unitsBySemester",unitsBySemester);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findProfessor = () => {
    UserDataService.find(params.professorID,"_id")
    .then(response => {
      console.log(response.data);
      setProfessor(response.data.users[0]); 
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

  const sendEmailVisualisationToProfessor = (e) => {
    e.preventDefault();
    
    var templateParams = {
        to_name: professor.username,
        from_name: "Regina",
        message: ""
    };

    emailjs.send('service_hydq9to', 'template_60pyoub', templateParams, 'NcYzW9DFj2j-SUYXW')
      .then((result) => {
          console.log(result.text);
          setSubmittedVisualisation(true)
      }, (error) => {
          console.log(error.text);
      });
  };

  const ComponentToPrint = React.forwardRef((props, ref) => (
    <div id="capture" ref={ref} paperSize="auto" margin={40} >
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
                    <div >
                      {
                        <Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                          start={dependency[0].toString()}  //can be react ref
                          end={dependency[1].toString()} //or an id
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
  
    // const decodeBase64 = decodeFileBase64(
    //   fileBase64String.substring(fileBase64String.indexOf(",") + 1)
    // );
    //console.log("data.file", formData)

    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', url, true);
    // var boundary = 'ohaiimaboundary';
    // xhr.setRequestHeader(
    //   'Content-Type', 'multipart/form-data; boundary=' + boundary);
    // xhr.sendAsBinary([
    //   '--' + boundary,
    //   'Content-Disposition: form-data; name="' + name + '"; filename="' + fn + '"',
    //   'Content-Type: ' + type,
    //   '',
    //   atob(data),
    //   '--' + boundary + '--'
    // ].join(''));
  }

  const renderButtonsSentOrView = () => {
    let content = <button type="button" ref={ImageInput} onClick={() => handlePostCanvas("#capture")} className="btn btn-secondary">
    Send student visualisation to {professor.username}
  </button>  
    for(let i = 0; i<imageVisualization.length; i++){
      if(imageVisualization[i].studentID == student._id ){
          content = <div className="btn btn-success">
              Visualization sent !
            </div>
        break;
      }
    }
    return content;
  }


  return (
    //<form onSubmit={deleteCourseByStudentID(params.id)}>
    <React.Fragment>
    <div>
      <div className="example-config">
        <button className="btn btn-secondary " 
        onChange = {onImageChange}
        onClick={() => exportImage("#capture")} >
         Export Visualisation
        </button>
      &nbsp;
      {renderButtonsSentOrView()}
      &nbsp;
      <button class="btn btn-secondary " onClick={() => navigate(-1)} >
        Return to previous page
      </button>
    </div>
      </div>
      <ComponentToPrint ref={componentRef} />
      </React.Fragment>

  );
};

export default StudentSendProf;

