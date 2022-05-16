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
  const [countUnitSemester1, setCountUnitSemester1] = useState(0)
  const [countUnitBySemester, setCountUnitBySemester] = useState(0)
  const [unitsBySemester, setUnitsBySemester] = useState([])
  const [idCourse, setIdCourse] = useState()
  const [professor, setProfessor] = useState(initialProfessorState)
  const [submittedVisualisation, setSubmittedVisualisation] = useState(false)
  const [image, setImage] = useState()
  const [user, setUser] = useState(initialUserState)
  const [imageVisualization, setImageVizualisation] = useState([])
  const [refreshKey, setRefreshKey] = useState(0);
  const componentRef = useRef();
  const ImageInput = React.createRef();



  
  useEffect(() => {
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


  const exportAsImage = async (element) => {
    const canvas = await html2canvas(element);
    console.log(canvas)
    const image = canvas.toDataURL("image/png", 1.0);
    // download the image
    };

  const container = React.useRef(null);
  const pdfExportComponent = React.useRef(null);
  
  const exportPDFWithComponent = () => {
      if (pdfExportComponent.current) {
        console.log(pdfExportComponent.current)
        pdfExportComponent.current.save();
      }
    }

  const updateTotalUnitForEachSemester = () => {
    for(let i=0; i<unitsBySemester.length; i++){
      if(unitsBySemester[i].yearOfLearning == 'א'){
        if(unitsBySemester[i].semesterOfLearning == 'א'){
          countUnitSemesters = unitsBySemester[i].units
        }
        if(unitsBySemester[i].semesterOfLearning == 'ב'){
          console.log("update");
          var data = {
            yearOfLearning: unitsBySemester[i].yearOfLearning,
            semesterOfLearning: unitsBySemester[i].semesterOfLearning,
            units: unitsBySemester[i].units + countUnitSemesters,
            studentID: params.studentID
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
            if (student.average <60)
              {
                            return (
                                <p>
                                <div className="col-sm1 text-white bg-secondary w-40 l-20">
                                  <strong> ת״ז : </strong>{student.student_id}
                                  <strong> | ממוצע : </strong>{student.average}
                                  <strong> | נק״ז : </strong>{student.valideunits} 
                                  <button class=" d-block  ml-auto" onClick={() => navigate(-1)} >         חריגה </button> <br/> 
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
                                <br/> 
                                </div>        
                              </p> 
                          )
                        }
                })()  
            }
         
          <div className="card text-center " >     
             שנה א      
          </div>  
            <div className="row">
            <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר א  
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'א'){
                if(unitBySemester.semesterOfLearning == 'א'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>
            </div>  
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {  
              if (course.yearOfLearning =='א'){
                if ((course.grade>55 && course.semesterOfLearning=='א' )){
                  if(course.courseName == 'חדו"א  - 1'){
                    return (
                      <div className="col-sm" id={(course.codeCourse).toString()}
                          key={course.codeCourses} >               
                      <div  className="card my-3 " ref={box1Ref}>     
                      <p className='bg-success text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                      </p>
                      </div> 
                     
                      </div> 
                      );
                    }
                    return (
                      <div className="col-sm text-white " id={(course.codeCourse).toString()}
                  key={course.codeCourses} >                 
                  <div  className="card my-3 ">     
                  <p className='bg-success text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                     </p>
                     </div> 
                     
                    </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='א' ){
                return (      
                   <div className="col-sm text-white "  
                    ref={el => {
                    // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                      if (!el) return;       
                      console.log(el.getBoundingClientRect()); // prints 200px
                    }}
                    key={index} >      
                     <div className="card my-3" style={{maxWidth: '18rem'}}>    
                     <p className='bg-danger text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                      </p>
                     </div>
                    
                   </div> 
                );}
                else if (course.semesterOfLearning=='א' ){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card"  style="width: 18rem;">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                       </div>
                    </div>         
                );}
              }
             }) 
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
          </div>
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר ב 
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'א'){
                if(unitBySemester.semesterOfLearning == 'ב'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>           
            </div>    
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {     
              if (course.yearOfLearning ==='א'){ 
                if (course.grade>55 && course.semesterOfLearning=='ב'){
                  if(course.courseName == 'חדוא 2 להנדסת תוכנה'){
                    return (
                      <div className="col-sm text-white " 
                          key={course.codeCourses}>                 
                      <div  className="card my-3 " id={(course.codeCourse).toString()}>     
                      <p className='bg-success text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                      </p>
                      </div> 
                      
                      {/* {<Xarrow curveness={0} path="grid" _cpx1Offset={-90} _cpy1Offset={58} _cpx2Offset={80} _cpy2Offset={-44}
                        start={box1Ref} //can be react ref
                        end={(course.codeCourse).toString()} //or an id
                      /> } */}
                      </div> 

                      );
                    }
               return (
                 <div className="col-sm text-white" id={(course.codeCourse).toString()}  
                  
                //  ref={el => {
                //   // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                //     if (!el) 
                //       return;  
                //     let coordinate = []     
                //     console.log(el.id); // prints 200px
                //     if(course.courseName == 'חדוא 2 להנדסת תוכנה'){
                //       console.log('hedva2',el.id)
                //       //const arrow = arrowLine(idCourse, el.id+"",{ color: 'blue' });
                //     //console.log('check',idCourse)
                //     }

                //     }}
                  key={index} >    
                   <div className="card my-3">    
                   <p className='bg-success text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                         
                       </h11>
                     </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ב'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card my-3">    
                     <p className='bg-danger text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                     </p>
                     </div>
                   </div> 
                );}
                else if(course.courseName == 'חדו"א  - 1') {
                  //console.log('good');
                  {student.courses.map((course1, index) => { 
                    if(course1.courseName == 'חדוא 2 להנדסת תוכנה'){
                      //console.log('good1');
                      return(
                        <svg height="210" width="500">
                          <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
                        </svg>
                      );
                    }
                  })
                }
                
                }
                else if (course.semesterOfLearning=='ב'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                     </p>   
                      </div>
                    </div>
                );}
              }
            })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
          </div>
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר ק
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'א'){
                if(unitBySemester.semesterOfLearning == 'ק'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>      
            </div>  

          
                
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='א'){      
                if (course.grade>55 && course.semesterOfLearning=='ק'){
               return (
                 <div id="no1" className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ק'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ק'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>   
                      </div>
                    </div>
                );}
              }
             })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
            
          </div> 
        
        
          <div className="card text-center " >    
            שנה ב     
          </div>  
          <div className="row">    
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר א 
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'א'){
                if(unitBySemester.semesterOfLearning == 'ב')
                  countUnitSemesters = unitBySemester.units
              }
              if(unitBySemester.yearOfLearning == 'ב'){
                if(unitBySemester.semesterOfLearning == 'א'){
                    return (<div>
                        נק״ז :{unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>   
          </div>            
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {   
              if (course.yearOfLearning =='ב'){   
                if (course.grade>55 && course.semesterOfLearning=='א'){
                return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card my-3">    
                        <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='א'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='א'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>    
                      </div>
                    </div>
                );}
             }
            })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
          </div>
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
               סמסטר ב
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ב'){
                if(unitBySemester.semesterOfLearning == 'ב'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>      
            </div>   
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='ב'){      
                if (course.grade>55 && course.semesterOfLearning=='ב'){
               return (
                 <div id="no1" className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ב'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ב'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>   
                      </div>
                    </div>
                );}
              }
             })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
            
          </div> 
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר ק
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ב'){
                if(unitBySemester.semesterOfLearning == 'ק'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>      
            </div>  

          
                
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='ב'){      
                if (course.grade>55 && course.semesterOfLearning=='ק'){
               return (
                 <div id="no1" className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ק'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ק'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>   
                      </div>
                    </div>
                );}
              }
             })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
            
          </div> 
        
        
          <div className="card text-center " >    
            שנה ג           
          </div>  
          <div className="row">    
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר א
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ג'){
                if(unitBySemester.semesterOfLearning == 'א'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>  
          </div>
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {   
              if (course.yearOfLearning =='ג'){   
                if (course.grade>55 && course.semesterOfLearning=='א'){
                return (
                 <div className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>  
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='א'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>  
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='א'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>     
                      </div>
                    </div>
                );}
             }
            })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
          </div>
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר ב   
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ג'){
                if(unitBySemester.semesterOfLearning == 'ב'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>
            </div> 
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='ג'){      
                if (course.grade>55 && course.semesterOfLearning=='ב'){
               return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card my-3">    
                   <p className='bg-success text-white text-center  '> 
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>  
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ב'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card my-3">    
                     <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>  
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ב'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card my-3">    
                      <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>      
                      </div>
                    </div>
                );}
              }
             })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
            
          </div> 

          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר ק
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ג'){
                if(unitBySemester.semesterOfLearning == 'ק'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>      
            </div> 
                
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='ג'){      
                if (course.grade>55 && course.semesterOfLearning=='ק'){
               return (
                 <div id="no1" className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ק'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ק'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>   
                      </div>
                    </div>
                );}
              }
             })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
            
          </div> 
        
        
          <div className="card text-center " >      
            שנה ד   
          </div>  
          <div className="row">    
          
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר א
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ד'){
                if(unitBySemester.semesterOfLearning == 'א'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>     
          </div>          
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {   
              if (course.yearOfLearning =='4'){   
                if (course.grade>55 && course.semesterOfLearning=='א'){
                return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card my-3">    
                   <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='א'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card my-3">    
                     <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='א'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card my-3">    
                      <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>    
                      </div>
                    </div>
                );}
             }
            })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
          </div>
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר ב
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ד'){
                if(unitBySemester.semesterOfLearning == 'ב'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>     
            </div>        
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='4'){      
                if (course.grade>55 && course.semesterOfLearning=='ב'){
               return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card  my-3" >    
                   <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ב'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card my-3">    
                     <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ב'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card my-3">    
                      <p className='bg-success text-white text-center  '>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>   
                      </div>
                    </div>
                );}
              }
             })
            ) : (
            <div className="col-sm-4">
              <p>No courses yet.</p>
            </div>
            )}
            
          </div>   
          <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר ק
            <div>
            {unitsBySemester.map((unitBySemester) => {
              if(unitBySemester.yearOfLearning == 'ד'){
                if(unitBySemester.semesterOfLearning == 'ק'){
                    return (<div>
                        נק״ז : {unitBySemester.totalunits } /  {unitBySemester.valideunits }
                    </div>); 
                }
              }
            })} 
            </div>      
            </div>  

          
                
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='ד'){      
                if (course.grade>55 && course.semesterOfLearning=='ק'){
               return (
                 <div id="no1" className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='ק'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='ק'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>   
                      </div>
                    </div>
                );}
              }
             })
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

