import React, { useState, useEffect} from "react";
import StudentDataService from "../services/studentService";
import { useParams  } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
const Student = props => {
  const params = useParams();
  console.log(params.id)

  const initialRestaurantState = {
    student_id: null,
    name: "",
    average: "",
    units: "",
    courses: []
  };
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(initialRestaurantState);

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
  
    const exportPDFWithMethod = () => {
      let element = container.current || document.body;
      savePDF(element, {
        paperSize: "auto",
        margin: 40,
        fileName: `Report for ${new Date().getFullYear()}`
      });
    };
  
    const exportPDFWithComponent = () => {
      if (pdfExportComponent.current) {
        pdfExportComponent.current.save();
      }
    };
  return (
    <div>
    <div className="example-config">
      <button className="k-button" onClick={exportPDFWithComponent}>
        Export with component
      </button>
      &nbsp;
      <button className="k-button" onClick={exportPDFWithMethod}>
        Export with method
      </button>
    </div>
    <div className="border rounded p-2">
    <PDFExport ref={pdfExportComponent} paperSize="auto" margin={40} fileName={`Report for ${new Date().getFullYear()}`} author="KendoReact Team">
      {student ? (
        <div>
          <h5>{student.name}</h5>
          <p>
            <strong>ID: </strong>{student.student_id}<br/>
            <strong>Name: </strong>{student.name}<br/>
            <strong>Average: </strong>{student.average}<br/>
            <strong>unit: </strong>{student.units}<br/>           
          </p>
          <h4> Courses </h4>
          <div className="row">
            {student.courses.length > 0 ? (
             student.courses.map((course, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         <strong>Course Name: </strong>{course.courseName}<br/>
                         <strong>Grade: </strong>{course.grade}<br/>
                         <strong>Year: </strong>{course.yearOfLearning}<br/>
                         <strong>Units: </strong>{course.units}<br/>
                         <strong>Start: </strong>{course.programStartDate}<br/>
                         <strong>End: </strong>{course.programEndDate}<br/>
                         <strong>Type: </strong>{course.typeOfCourse}<br/>
                         <strong>courseBefore: </strong>{course.courseBefore}
                       </p>
                     </div>
                   </div>
                   <div className="row">              
                  </div>
                 </div>
                 
               );
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