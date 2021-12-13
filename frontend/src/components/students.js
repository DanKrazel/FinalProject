import React, { useState, useEffect} from "react";
import StudentDataService from "../services/studentService";
import { Link,  useParams  } from "react-router-dom";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


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


  return (
    <div>
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
                         <strong>Course Name: </strong>{course.name}<br/>
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
    </div>
  );
};

export default Student;