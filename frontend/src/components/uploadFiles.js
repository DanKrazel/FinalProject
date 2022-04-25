import React, { useState, useEffect } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { Redirect, useLocation } from 'react-router'
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import CourseDataService from "../services/courseService"
import FileDataService from "../services/fileService"
import StudentDataService from "../services/studentService"
import { Link, Navigate } from "react-router-dom";
import { fileURLToPath } from "url";
import axios from 'axios';
import pdfjsLib  from "pdfjs-dist/build/pdf"


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
  const [CsvReport, setCsvReport] = useState([])
  const fileInputCourses = React.createRef();
  const fileInputStudents = React.createRef();
  const [selectedFile, setSelectedFile] = useState()
  const [submitted, setSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [students, setStudents] = useState([])
  const [selectFile, setSelectFile] = useState([])
  const [dataCSV, setDataCSV] = useState([]);
  const [IDfile, setIDfile] = useState("")

  const params = useParams();


  useEffect(() => {
    //console.log(handlePDfCourse())
    retrieveCourses();
  }, [refreshKey]);


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
      console.log("data",data)
    };
    reader.readAsBinaryString(file);
  }

  /*const uploadFileToDB = e => {
    const file = e.target.files[0]
    console.log(file)
    CourseDataService.uploadCourse(file, params.id)
  }*/

  // handle click event of the upload button
  const handleOnSubmit = e => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('file',fileInputCourses.current.files[0])

    var data = {
      file: fileInputCourses.current.files[0],
    };
    console.log("fileInputCourses.current.files",data.file)
    // if(courses.length != 0){
    //   params.average=0;
    //   CourseDataService.deleteCourseByStudentID(params.id)
    //   .then(response => {
    //     console.log(response.data);
    //   })
    //   alert(
    //     `CSV file was deleted`
    //   );
    //   setRefreshKey(oldKey => oldKey +1)
    // }
      if(data.file){
        CourseDataService.uploadCoursesAllStudents(formData)
        .then(response => {
          setSubmitted(!submitted);
          setDataCSV(response.data)
          console.log(response.data);
        })
        alert(
          `Selected file - ${data.file.name} was uploaded`
        );
        setRefreshKey(oldKey => oldKey +1)
        }
      else{
        alert(
          'Selected file - None, choose a file to upload'
        )
      }

    //setSubmitted(true);
    //let navigate = useNavigate();
    console.log(submitted)

    }

    const handlePostStudentsOnSubmit = e => {
      e.preventDefault();
      const formData = new FormData()
      formData.append('file',fileInputStudents.current.files[0])
      var data = {
        file: fileInputStudents.current.files[0],
      };
      console.log("fileInputStudents.current.files[0]",data.file)
      if(students.length != 0){
        StudentDataService.deleteAllStudents()
        .then(response => {
          console.log(response.data);
        })
        alert(
          `CSV file was deleted`
        );
        setRefreshKey(oldKey => oldKey +1)
      }
      else{
        if(data.file){
          StudentDataService.uploadStudents(formData)
          .then(response => {
            console.log(response.data);
          })
          alert(
            `Selected file - ${data.file.name} was uploaded`
          );
          setRefreshKey(oldKey => oldKey +1)
          }
        else{
          alert(
            'Selected file - None, choose a file to upload'
          )
        }
      }
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


  let navigate = useNavigate();
  return (
    <div>
      <h3>Upload files</h3>
    <div >
    <form  onSubmit={handleOnSubmit} encType='multipart/form-data'>
    <input
        type="file"
        accept=".csv,.xlsx,.xls,.xml"
        ref={fileInputCourses}
        id="myFileCourses"
        //onChange={handleFileUpload}
      />
    {/* { courses.length != 0 ? (
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
          )} */}
      <input
              className="btn btn-primary" 
              type="submit"
              value="Upload csv file"
            //onClick={redirect}
            //onClick={() => setSubmitted(!submitted)}
            //onChange={navigate(`/students/${params.id}`)}
          />
    
    <DataTable
        pagination
        highlightOnHover
        columns={columnsCourses}
        data={data}
      />
    </form>  
    </div>

    
    <div >
    <form  onSubmit={handlePostStudentsOnSubmit} encType='multipart/form-data'>
    <input
        type="file"
        accept=".csv,.xlsx,.xls,.xml"
        ref={fileInputStudents}
        //onChange={handleFileUpload}
      />
    { students.length != 0 ? (
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
    
    </form>  
    </div>

    </div>
                
    /* <Link to={"/"} class="btn btn-primary">
        Return to previous page
      </Link> */
   
  );
};
export default UploadFiles;