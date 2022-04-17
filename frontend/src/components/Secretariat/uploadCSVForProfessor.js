import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { Redirect, useLocation } from 'react-router'
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import CourseDataService from "../../services/courseService"
import FileDataService from "../../services/fileService"
import StudentDataService from "../../services/studentService"
import UserDataService from "../../services/userService"
import UnitsBySemesterDataService from "../../services/unitsBySemesterService";
import { Link, Navigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { fileURLToPath } from "url";
import axios from 'axios';



const UploadCSVForProfessor = props => {

  const initialStudentState = {
    student_id: "",
    name: "",
    average: "",
    units: "",
    years:"",
  };

  const initialProfessorState = {
    _id: "",
    user_id:"",
    username: "",
    mail: "",
    role:"",
  };

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [CsvReport, setCsvReport] = useState([])
  const fileInput = React.createRef();
  let initialFileState = ""
  const [selectedFile, setSelectedFile] = useState()
  const [submitted, setSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [student, setStudent] = useState(initialStudentState)
  const [professor, setProfessor] = useState(initialProfessorState)
  const [submittedVisualisation, setSubmittedVisualisation] = useState(false)
  const [selectFile, setSelectFile] = useState([])
  const [dataCSV, setDataCSV] = useState([]);
  const [IDfile, setIDfile] = useState("")

  const params = useParams();
  const form = useRef();


  useEffect(() => {
    retrieveCourses();
    findStudent();
    findProfessor();
  }, [refreshKey]);

  const retrieveCourses = () => {
    CourseDataService.find(params.studentID, "studentID")
      .then(response => {
        console.log(response.data);
        setCourses(response.data.courses); 
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findStudent = () => {
    console.log(params.studentID)
    StudentDataService.find(params.studentID,"_id")
    .then(response => {
      console.log(response.data);
      setStudent(response.data.students[0]); 
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

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
    console.log(list)
    console.log(columns)
  }

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      setCsvReport(bstr)
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
      //console.log(data)
    };
    reader.readAsBinaryString(file);
  }


  // handle click event of the upload button
  const handleOnSubmit = e => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('file',fileInput.current.files[0])

    var data = {
      file: fileInput.current.files[0],
      studentID: params.studentID,
    };
    console.log(selectedFile)
    if(courses.length != 0){
      params.average=0;
      CourseDataService.deleteCourseByStudentID(params.studentID)
      .then(response => {
        console.log(response.data);
      })
      UnitsBySemesterDataService.deleteUnitsBySemesterByStudentID(params.studentID)
      .then(response => {
        console.log(response.data);
      })
      alert(
        `CSV file was deleted`
      );
      setRefreshKey(oldKey => oldKey +1)
    }
    else{
      if(fileInput.current.files[0]){
        FileDataService.uploadFile(formData, data.studentID)
        .then(response => {
          setSubmitted(!submitted);
          setDataCSV(response.data)
          console.log(response.data);
        })
        alert(
          `Selected file - ${fileInput.current.files[0].name} was uploaded`
        );
        setRefreshKey(oldKey => oldKey +1)
        }
      else{
        alert(
          'Selected file - None, choose a file to upload'
        )
      }
    }

    //setSubmitted(true);
    //let navigate = useNavigate();
    console.log(submitted)

    }



    const getFile = id => {
      FileDataService.get(id)
        .then(response => {
          setSelectFile(response.data);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    };

    const sendVisualisationToProfessor = () => {
        
    }

    

    /*const redirect = () => {
      let navigate = useNavigate();
      return {() => navigate(`/students/${params.id}`)}
    }*/

  let navigate = useNavigate();
  return (
    <form onSubmit={handleOnSubmit} encType='multipart/form-data'>
    <div>
      <h3>Upload grades student - {student.name}</h3>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        ref={fileInput}
        onChange={handleFileUpload}
      />
    { courses.length != 0 ? (
            <input
            className="btn btn-primary" 
            type="submit"
            value="Reset csv file"
          />
          ) : (            
            <input
              className="btn btn-primary" 
              type="submit"
              value="Upload csv file"
            //onClick={redirect}
            //onClick={() => setSubmitted(!submitted)}
            //onChange={navigate(`/students/${params.id}`)}
          />
          )}
        &nbsp;
      <Link to={"/studentSendProf/" + params.studentID + "/" + params.professorID} className="btn btn-primary">
        View student visualisation
      </Link>      
      &nbsp;
      <button type="button" onClick={() => navigate(-1)} class="btn btn-primary">
        Return to previous page
      </button>

    </div>
      <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </form>     
  );
};
export default UploadCSVForProfessor;