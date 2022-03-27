import React, { useState, useEffect} from "react";
import StudentDataService from "../services/studentService";
import CourseDataService  from "../services/courseService";
import { useParams, useNavigate  } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import "../App.css";
import styles from "../index.css"

const Student = props => {
  const params = useParams();
  var countUnitSemesters = 0;
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
    units: "",
    semester:"",
    years:"",
    courses: []
  };

  const rootStyle = { display: 'flex', justifyContent: 'center' };
  const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between' };
  const boxStyle = { padding: '10px', border: '1px solid black' };
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(initialStudentState);
  //const [refreshKey, setRefreshKey] = useState(0);
  const [countUnitSemester1, setCountUnitSemester1] = useState(0)

  
  useEffect(() => {
    getStudent(params.id);
    //retrieveStudents();
  }, []);
  
  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
        setStudent(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveStudents = () => {
    StudentDataService.getAll()
      .then(response => {
        console.log(response.data);
        setStudents(response.data.students);
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


  let navigate = useNavigate()
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
            if ((student.average <60 ) || ( student.years=== 'ב'  && student.units<36) || (( student.years=== 'ג'  && student.units<75 )) || (( student.years=== 'ד'  && student.units<115 )) )
              {
                            return (
                                <p>
                                <div className="col-sm1 text-white bg-secondary w-40 l-20">
                                  <strong> ת״ז : </strong>{student.student_id}
                                  <strong> | ממוצע : </strong>{student.average}
                                  <strong> | שנה : </strong>{student.years}
                                  <strong> | נק״ז : </strong>{student.units} 
                                  <strong> |  : </strong>{student.units} 
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
                                <strong> | נק״ז : </strong>{student.units} 
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
            </div>  
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {  
              if (course.yearOfLearning =='א'){
                if ((course.grade>55 && course.semesterOfLearning=='א' )){
                return (
                 <div className="col-sm text-white "  key={index} >
                  <div className="card my-3 " style={{maxWidth: '20rem'}}>     
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
                   <div className="col-sm text-white "  key={index} >      
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
            </div>    
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {     
              if (course.yearOfLearning ==='א'){ 
                if (course.grade>55 && course.semesterOfLearning=='ב'){
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
          <div className="card text-center " >    
            שנה ב     
          </div>  
          <div className="row">    
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר א 
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
          <div className="card text-center " >    
            שנה ג           
          </div>  
          <div className="row">    
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            סמסטר א
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
          <div className="card text-center " >      
            שנה ד         
          </div>  
          <div className="row">    
          
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              סמסטר א           
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

