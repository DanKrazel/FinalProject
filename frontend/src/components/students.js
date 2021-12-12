import React, { useState, useEffect} from "react";
import StudentDataService from "../services/studentService";
import { Link,  useParams  } from "react-router-dom";

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
              <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">course_id</th>
                  <th scope="col">course name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>{student.courses.course_id}</td>
                  <td>{student.courses.name}</td>
                </tr>
              </tbody>
            </table>               
          </p>
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