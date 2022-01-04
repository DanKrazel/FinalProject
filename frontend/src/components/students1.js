import React, { useState, useEffect} from "react";
import StudentDataService from "../services/studentService";
import { useParams  } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { ArcherContainer, ArcherElement } from 'react-archer';




const Student = props => {
  const params = useParams();
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
  useEffect(() => {
    getStudent(params.id)
    retrieveStudents()
  }, []);
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

  return (
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
        Save PDF to Blockain
      </button>
    </div>
    
    <div >
    <PDFExport ref={pdfExportComponent} paperSize="auto" margin={40} fileName={`Report for ${new Date().getFullYear()}`} author="KendoReact Team">
      {student ? (
        <div>
          <h5>{student.name}</h5>
          <p>
          <div className="col-sm text-white bg-secondary w-40 l-20">
            <strong> ת״ז : </strong>{student.student_id}
            <strong> | ממוצע : </strong>{student.average}
            <strong> | שנה : </strong>{student.years}
            <strong> | סמסטר : </strong>{student.semester} 
            <strong> | נק״ז : </strong>{student.units}<br/>   
            </div>        
          </p>   
          <div className="card text-center " >     
            Year 1     
          </div>  
            <div className="row">
            <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              Semester 1  
            </div>  
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {  
              if (course.yearOfLearning =='1'){
                if ((course.grade>55 && course.semesterOfLearning=='1' )){
                return (
                 <div className="col-sm text-black "  key={index} >
                  <div className="card my-3 " >     
                  <p className='bg-success text-white text-center  rounded-circle h-90 my-3'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                     </p>
                     </div> 
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='1' ){
                return (      
                   <div className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                     <p className='bg-danger text-white text-center  rounded-circle h-90 my-3'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                      </p>
                     </div>
                    
                   </div> 
                );}
                else if (course.semesterOfLearning=='1' ){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card">    
                      <p className='bg-secondary text-white text-center  rounded-circle h-90 my-3'>
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
              Semester 2  
            </div>    
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {     
              if (course.yearOfLearning =='1'){ 
                if (course.grade>55 && course.semesterOfLearning=='2'){
               return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card my-3">    
                   <p className='bg-success text-white text-center  rounded-circle h-90 my-3'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                         
                       </h11>
                     </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='2'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card my-3">    
                     <p className='bg-danger text-white text-center  rounded-circle h-90 my-3'>
                       <h11>
                         {course.courseName}<br/>
                         {course.grade}<br/>
                         {course.units}
                       </h11>
                     </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='2'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card my-3">    
                      <p className='bg-secondary text-white text-center  rounded-circle h-90 my-3'>
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
            Year 2    
          </div>  
          <div className="row">    
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              Semester 1  
            </div>            
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {   
              if (course.yearOfLearning =='2'){   
                if (course.grade>55 && course.semesterOfLearning=='1'){
                return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card my-3">    
                        <p className='bg-success text-white text-center rounded-circle h-90 my-3'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='1'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center  rounded-circle h-90 my-3'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='1'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center  rounded-circle h-90 my-3'>
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
              Semester 2  
            </div>      
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='2'){      
                if (course.grade>55 && course.semesterOfLearning=='2'){
               return (
                 <div className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center  rounded-circle h-90 my-3'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='2'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center  rounded-circle h-90 my-3'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='2'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center  rounded-circle h-90 my-3'>
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
            Year 3    
          </div>  
          <div className="row">    
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              Semester 1  
            </div>
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {   
              if (course.yearOfLearning =='3'){   
                if (course.grade>55 && course.semesterOfLearning=='1'){
                return (
                 <div className="col-sm text-white "  key={index} >      
                     <div className="card my-3">    
                      <p className='bg-success text-white text-center  rounded-circle h-90 my-3'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>  
                   </div>
                  
                 </div> 
                );}
                else if (course.grade<56 && course.semesterOfLearning=='1'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                       <div className="card my-3">    
                      <p className='bg-danger text-white text-center  rounded-circle h-90 my-3'>
                          <h11>
                            {course.courseName}<br/>
                            {course.grade}<br/>
                            {course.units}
                          </h11>
                        </p>  
                     </div>
                   </div> 
                );}
                else if (course.semesterOfLearning=='1'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                        <div className="card my-3">    
                      <p className='bg-secondary text-white text-center  rounded-circle h-90 my-3'>
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
              Semester 2 
            </div> 
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='3'){      
                if (course.grade>55 && course.semesterOfLearning=='2'){
               return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card">    
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
                else if (course.grade<56 && course.semesterOfLearning=='2'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card">    
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
                else if (course.semesterOfLearning=='2'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card">    
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
            Year 4    
          </div>  
          <div className="row">    
          
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
              Semester 1  
            </div>          
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {   
              if (course.yearOfLearning =='4'){   
                if (course.grade>55 && course.semesterOfLearning=='1'){
                return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card">    
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
                else if (course.grade<56 && course.semesterOfLearning=='1'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card">    
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
                else if (course.semesterOfLearning=='1'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card">    
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
              Semester 2 
            </div>        
            {student.courses.length > 0  ? (
             student.courses.map((course, index) => {
              if (course.yearOfLearning =='4'){      
                if (course.grade>55 && course.semesterOfLearning=='2'){
               return (
                 <div className="col-sm text-white "  key={index} >      
                   <div className="card " >    
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
                else if (course.grade<56 && course.semesterOfLearning=='2'){
                return ( 
                   <div className="col-sm text-white "  key={index} >     
                     <div className="card">    
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
                else if (course.semesterOfLearning=='2'){
                  return ( 
                    <div className="col-sm text-white "  key={index} >      
                      <div className="card">    
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

