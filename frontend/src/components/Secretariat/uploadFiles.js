import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { Redirect, useLocation } from 'react-router'
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import CourseDataService from "../../services/courseService"
import StudentDataService from "../../services/studentService"
import RequestDataService from "../../services/requestsService"
import UserDataService from "../../services/userService"
import CourseDetailsDataService from "../../services/courseDetailsService"
import { Link, Navigate } from "react-router-dom";
import { fileURLToPath } from "url";
import axios from 'axios';
import { Helmet } from "react-helmet"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "../../styles/uploadFiles.css";



const UploadFiles = props => {


  const initialStudentState = {
    student_id: "",
    name: "",
    average: "",
    units: "",
    years:"",
  };

  var indexFile = 0;

  const [columnsCourses, setColumnsCourses] = useState([]);
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesDetails, setCoursesDetails] = useState([]);
  const [CsvReport, setCsvReport] = useState([])
  const [selectedFile, setSelectedFile] = useState()
  const [submitted, setSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [students, setStudents] = useState([])
  const [selectFile, setSelectFile] = useState([])
  const [dataCSV, setDataCSV] = useState([]);
  const [IDfile, setIDfile] = useState("")
  const [studentsDeleted, setStudentsDeleted] = useState(false)
  const [coursesDeleted, setCoursesDeleted] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [content, setContent] = useState(null);
  const [requests, setRequests] = useState([]);

  const fileInputCourses = React.createRef();
  const fileInputCoursesDetails = React.createRef();
  const fileInputStudents = React.createRef();



  const params = useParams();


  useEffect(() => {
    //console.log(handlePDfCourse())
    retrieveContent();
    retrieveCourses();
    retrieveStudents();
    retrieveRequests();
    retrieveCoursesDetails();
    //customUploadFiles();
  }, [refreshKey]);

  const retrieveContent = () => {
    UserDataService.getSecretariatBoard()
    .then(response => {
        console.log("response",response)
    })
    .catch(error => {
      setContent((error.response &&
        error.response.data &&
        error.response.data.message) ||
        error.message ||
        error.toString())
    });
}


  const retrieveRequests = () => {
    RequestDataService.getAll()
      .then(response => {
        console.log(response.data)
        setRequests(response.data.requests); 
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCourses = () => {
    CourseDataService.getAll()
      .then(response => {
        console.log(response.data);
        setCourses(response.data.courses); 
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCoursesDetails = () => {
    CourseDetailsDataService.getAll()
      .then(response => {
        console.log('Courses details', response.data);
        setCoursesDetails(response.data.coursesDetails); 
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
        console.log("students",students )
      })
      .catch(e => {
        console.log(e);
      });
  };

  function multipleExist(arr, values) {
    return values.every(value => {
      return arr.includes(value);
    });
  }

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    let min;
    let headerTemp;
    console.log("dataStringLines", dataStringLines)
    // min = dataStringLines[0].length
    // for(let i=0; i<dataStringLines.length; i++ ){
    //   if(multipleExist(dataStringLines[i],['קוד קורס','סמס','שם קורס','סוג','שם מרצה','\"ש\"\"ס\"','נזיכוי','ציון'])) {
    //     headerTemp = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    //     break;
    //   }
    // }

    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    console.log("min", min)
    console.log("headers", headers)
    //console.log("header", headers)
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      console.log("row", row)
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"' || d[0] === '.')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"' || d[d.length - 1] === '.')
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
    setColumnsCourses(columns);
    console.log("list",list)
    console.log("columns",columns)
  }

  // handle file upload
  const handleFileUpload = (e) => {
    // const file = e.target.files[0]
    // const reader = new FileReader();
    // reader.onload = (evt) => {
    //   /* Parse data */
    //   const bstr = evt.target.result;
    //   setCsvReport(bstr)
    //   const wb = XLSX.read(bstr, { type: 'binary' });
    //   /* Get first worksheet */
    //   const wsname = wb.SheetNames[0];
    //   const ws = wb.Sheets[wsname];
    //   /* Convert array of arrays */
    //   const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
    //   processData(data);
    //   console.log("data",data)
    // };
    // reader.readAsBinaryString(file);
    console.log(fileInputCourses.current.files)
  }

  /*const uploadFileToDB = e => {
    const file = e.target.files[0]
    console.log(file)
    CourseDataService.uploadCourse(file, params.id)
  }*/

  // handle click event of the upload button
  const handlePostCoursesForStudent = e => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('file',fileInputCourses.current.files[0])

    var data = {
      file: fileInputCourses.current.files[0],
    };
    console.log("fileInputCourses.current.files",data.file)
    if(courses.length != 0){
      CourseDataService.deleteAllCourses()
      .then(response => {
        setCoursesDeleted(true)
        console.log(response.data);
        setRefreshKey(oldKey => oldKey +1)
      })
      alert(
        `All courses was deleted`
      );

    }
    else{
      if(data.file){
        CourseDataService.uploadCoursesAllStudents(formData)
        .then(response => {
          setSubmitted(!submitted);
          setDataCSV(response.data)
          console.log(response.data);
          setRefreshKey(oldKey => oldKey +1)
        })
        alert(
          `Selected file - ${data.file.name} was uploaded`
        );
        }
      else{
        alert(
          'Selected file - None, choose a file to upload'
        )
      }

    console.log(submitted)

    }
  }

  const handlePostCoursesDetails = e => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('file',fileInputCoursesDetails.current.files[0])
    var data = {
      file: fileInputCoursesDetails.current.files[0],
    };
    if(coursesDetails.length != 0){
      CourseDetailsDataService.deleteAllCoursesDetails()
      .then(response => {
        console.log(response.data);
        setRefreshKey(oldKey => oldKey +1);
      })
      alert(
        `All courses was deleted`
      );
    }
    else{
      if(data.file){
        CourseDetailsDataService.uploadDetailsCourses(formData)
        .then(response => {
          console.log('response upload details courses', response.data);
          setRefreshKey(oldKey => oldKey +1)
        })
        alert(
          `Selected file - ${data.file.name} was uploaded`
        );
        }
      else{
        alert(
          'Selected file - None, choose a file to upload'
        )
      }
    }
  }

    const handlePostStudents = e => {
      e.preventDefault();
      const formData = new FormData()
      formData.append('file',fileInputStudents.current.files[0])
      var data = {
        file: fileInputStudents.current.files[0],
      };
      console.log("fileInputStudents.current.files[0]",data.file)
      if(data.file){
        StudentDataService.uploadStudents(formData)
        .then(response => {
          console.log(response.data);
          setRefreshKey(oldKey => oldKey +1)
        })
        alert(
          `Selected file - ${data.file.name} was uploaded`
        );
        }
      else{
        alert(
          'Selected file - None, choose a file to upload'
        )
      }
    }

    const deleteAllStudent = () => {
      StudentDataService.deleteAllStudents()
        .then(response => {
          RequestDataService.deleteAllRequests()
            .then(response => {
              console.log(response.data);
              setRefreshKey(oldKey => oldKey +1)
        })
          console.log(response.data);
        })
        alert(
          `CSV file was deleted`
        );
    }

    const deleteAllCoursesDetails = () => {
      CourseDetailsDataService.deleteAllCoursesDetails()
        .then(response => {
          console.log('deleteAllCourse',response)
          setRefreshKey(oldKey => oldKey +1)
          alert(
            `CSV file was deleted`
          );
        })
        .catch(e => {
          console.log(e);
        });
    }

    // async function handlePDfCourse (e) {
    //   e.preventDefault();
    //   const formData = new FormData()
    //   formData.append('file',fileInput.current.files[0])
    //   if(fileInput.current.files[0]){
    //     FileDataService.uploadPDF(formData)
    //     .then(response => {
    //       setSubmitted(!submitted);
    //       console.log(response.data);
    //       console.log("formdata", formData)
    //     })
    //     alert(
    //       `Selected file - ${fileInput.current.files[0].name} was uploaded`
    //     );
    //     setRefreshKey(oldKey => oldKey +1)
    //     }
    //   else{
    //     alert(
    //       'Selected file - None, choose a file to upload'
    //     )
    //   }
    //   var file = e.target.files[0]
    //   console.log("file", file)
    //   //const reader = new FileReader();
    //   const doc = await pdfjsLib.getDocument(file).promise // note the use of the property promise
    //   const page = await doc.getPage(1)
    //   var content = page.getTextContent()
    //   console.log("filePDF", content)
    //   return content.items.map((item) => item.str)
    // }

    const customUploadFiles = () => {
      const script = document.createElement("script")
      script.ready(function() {
          document.getElementById("#myFileCourses").fileinput({
          rtl: true,
          dropZoneEnabled: false,
        })
      })
      document.body.appendChild(script)
    }


    const handleDisplayFileDetails = () => {
      fileInputCourses.current?.files &&
        setUploadedFileName(fileInputCourses.current.files[0].name);
    };

  let navigate = useNavigate();
  return (
  <div>
  {!content ? (
    <div>
      <h3>לעלות את הקבצים</h3>
    <div >
    <form onSubmit={handlePostCoursesForStudent} encType='multipart/form-data'>
    <div class="input-group mb-3">
    <input
        type="file"
        accept=".csv,.xlsx,.xls,.xml"
        data-allowed-file-extensions='["csv","xlsx", "xml", "xls"]'
        class="form-control"
        ref={fileInputCourses}
        id="myFileCourses"
        onChange={handleFileUpload}
      />
      { courses.length != 0 ? (
      <button type="submit" className="btn btn-primary" for="myFileCourses">
        אפס את קובץ הקורסים
      </button>
      ):(
        // <input
        // className="btn btn-primary" 
        // type="submit"
        // value="Upload csv file"
        //   //onClick={redirect}
        //   //onClick={() => setSubmitted(!submitted)}
        //   //onChange={navigate(`/students/${params.id}`)}
        // />
        <button type="submit" className="btn btn-primary" for="myFileCourses">
            לעלות את קובץ הקורסים
        </button>
      )}
    </div>

    
    {/* <DataTable
        pagination
        highlightOnHover
        columns={columnsCourses}
        data={data}
      /> */}
    </form>  
    </div>

    {/* Upload course details */}
    <div>
    <form onSubmit={handlePostCoursesDetails} encType='multipart/form-data'>
    <div class="input-group mb-3">
    <input
        type="file"
        accept=".csv,.xlsx,.xls,.xml"
        data-allowed-file-extensions='["csv","xlsx", "xml", "xls"]'
        class="form-control"
        ref={fileInputCoursesDetails}
        id="myFileCourses"
        onChange={handleFileUpload}
      />
      { coursesDetails.length != 0 ? (
      <button type="submit" className="btn btn-primary" for="myFileCourses">
        אפס את קובץ פרטי הקורסים
      </button>
      ):(
        // <input
        // className="btn btn-primary" 
        // type="submit"
        // value="Upload csv file"
        //   //onClick={redirect}
        //   //onClick={() => setSubmitted(!submitted)}
        //   //onChange={navigate(`/students/${params.id}`)}
        // />
        <button type="submit" className="btn btn-primary" for="myFileCourses">
            לעלות את קובץ פרטי הקורסים
        </button>
      )}
    </div>

    
    {/* <DataTable
        pagination
        highlightOnHover
        columns={columnsCourses}
        data={data}
      /> */}
    </form>  
    </div>

    
    <div class="input-group mb-3">
    <input
        type="file"
        class="form-control"
        accept=".csv,.xlsx,.xls,.xml"
        ref={fileInputStudents}
        id="myFileStudents"
        //onChange={handleFileUpload}
      />
    { students.length != 0 ? (
      requests.length != 0 ? (
      <Popup trigger={<button type="button" className="btn btn-primary" for="myFileStudents">אפס את קובץ של הסטודנטים</button>} 
        modal
        nested
        >
      {close => (
      <div className="modals">
      <button className="close" onClick={close}>
            &times;
      </button>
      <div className="header"> אַזהָרָה </div>
      <div className="content">
            {' '}
            Alert ! If you delete all students, requests of visualizations from professors
            will be deleted !
            <br />
          </div>
      <div className="actions">
        <button
              className="btn btn-primary" style={{margin:"10px 15px"}} 
              onClick={() => {
                console.log('modal closed ');
                close();
              }}
            >
              לחזור
            </button>
          <Link to="/view-requests" className="btn btn-primary" style={{margin:"10px 15px"}}>
            לעבור לדף של הבקשות
          </Link>
          <button type="submit" className="btn btn-primary" style={{margin:"10px 15px"}} onClick={deleteAllStudent}>
          אפס את קובץ של הסטודנטים
          </button>
      </div>
      </div>
      )}
      </Popup>
      ):(
        <button type="submit" className="btn btn-primary" onClick={deleteAllStudent}>
            אפס את קובץ של הסטודנטים
        </button>
      )
      ):(
        // <input
        // className="btn btn-primary" 
        // type="submit"
        // value="Upload csv file"
        //   //onClick={redirect}
        //   //onClick={() => setSubmitted(!submitted)}
        //   //onChange={navigate(`/students/${params.id}`)}
        // />
        <button type="submit" className="btn btn-primary" for="myFileStudents" onClick={handlePostStudents}>
            לעלות את קובץ של הסטודנטים
          </button>
      )} 
    </div>
    <Link to="/AddDependencies" className="btn btn-primary">
            להוסיף תלויות
    </Link>
    &nbsp;
    <Link to="/ManageDependencies" className="btn btn-primary">
            לנהל את התלויות
    </Link>

    </div>
                
    /* <Link to={"/"} class="btn btn-primary">
        Return to previous page
      </Link> */
      ):(
        <div className="container">
          <header className="jumbotron">
            <h3>{content}</h3>
          </header>
        </div>
                  )}
    </div>
  );
};
export default UploadFiles;