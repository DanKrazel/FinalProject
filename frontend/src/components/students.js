import React, { useState, useEffect, useRef} from "react";
import StudentDataService from "../services/studentService";
import CourseDataService  from "../services/courseService";
import UnitsBySemesterDataService from "../services/unitsBySemesterService";
import { useParams, useNavigate  } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import "../App.css";
import * as arrowLine from 'arrow-line';
import styles from "../index.css"
import getCoordinate from "./getCoordinate.js";
import Xarrow from "react-xarrows";


const Student = props => {
  const listCourses1 = ['חדו"א  - 1', 'מבנה נתונים-ה', 'מבוא למדעי המחשב', 'I ארכיטקטורת מחשבים']
  const params = useParams();
  var countUnitSemesters = 0
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
    semester:"",
    years:"",
    courses: []
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

  
  useEffect(() => {
    console.log("useEffect student")
    getStudent(params.id);
    getUnitsBySemester(params.id);
    updateTotalUnitForEachSemester();
  }, []);

  function sleep(time){
      return new Promise((resolve)=>setTimeout(resolve,time)
    )
  }

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
        response.data.average=Math.round((response.data.average/response.data.totalunits) * 100) / 100
        setStudent(response.data);

        console.log(response.data);
        console.log("student", student)
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

  const container = React.useRef(null);
  const pdfExportComponent = React.useRef(null);
  
  const exportPDFWithComponent = () => {
      if (pdfExportComponent.current) {
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
  return (
    //<form onSubmit={deleteCourseByStudentID(params.id)}>
    <div>
      <div className="example-config">
        <button className="k-button" onClick={exportPDFWithComponent}>
         Export PDF
        </button>
      &nbsp;
      <button className="k-button" onClick={exportPDFWithComponent}>
        Send PDF to verification 
      </button>
      <button className="k-button" onClick={exportPDFWithComponent}>
        Save PDF to Blockchain
      </button>
      <button class="position-absolute top-right" onClick={() => navigate(-1)} >
        Return to previous page
      </button>
    </div>
    <div >
    <PDFExport ref={pdfExportComponent} paperSize="auto" margin={40} fileName={`Report for ${new Date().getFullYear()}`} author="KendoReact Team">
      {student ? (  
        <div >
          <h5>{student.name}</h5>
          {(() => {
            if ((student.average <60 ) || ( student.years=== 'ב'  && student.totalunits<36) || (( student.years=== 'ג'  && student.totalunits<75 )) || (( student.years=== 'ד'  && student.totalunits<115 )) )
              {
                            return (
                                <p>
                                <div className="col-sm1 text-white bg-secondary w-40 l-20">
                                  <strong> ת״ז : </strong>{student.student_id}
                                  <strong> | ממוצע : </strong>{student.average}
                                  <strong> | שנה : </strong>{student.years}
                                  <strong> | נק״ז : </strong>{student.totalunits} 
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
                                <strong> | שנה : </strong>{student.years}
                                <strong> | נק״ז כללי: </strong>{student.totalunits} 
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
                      /*ref={el => {
                    // el can be null - see https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                    if (!el) 
                      return;  
                    let coordinate = []     
                    //console.log(el.id); // prints 200px
                    if(course.courseName == 'חדו"א  - 1'){
                      //coordinate = el.getBoundingClientRect()
                      //console.log("coordinate", coordinate)
                      setIdCourse(el.id)
                      console.log(el.id)
                      //console.log('check',idCourse)
                    }
                    //const arrow = arrowLine('#300021', '#300021');

                  }}*/
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
                      
                      {<Xarrow curveness={0} path="grid" _cpx1Offset={-90} _cpy1Offset={58} _cpx2Offset={80} _cpy2Offset={-44}
                        start={box1Ref} //can be react ref
                        end={(course.codeCourse).toString()} //or an id
                      /> }
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
      </PDFExport>
      </div>
      </div>

  );
};

export default Student;

