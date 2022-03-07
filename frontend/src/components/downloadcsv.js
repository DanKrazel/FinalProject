import React, { useState, useEffect } from "react";
import { useParams  } from "react-router-dom";
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import CourseDataService from "../services/courseService"
import FileDataService from "../services/fileService"
import { Link } from "react-router-dom";
import { fileURLToPath } from "url";
import axios from 'axios';
import Papa from "papaparse"


const Downloadcsv = props => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [CsvReport, setCsvReport] = useState([])
  const fileInput = React.createRef();
  let initialFileState = ""
  const [selectedFile, setSelectedFile] = useState(initialFileState);
  const [submitted, setSubmitted] = useState(false);
  const [selectFile, setSelectFile] = useState([])
  const [dataCSV, setDataCSV] = useState([]);
  const [IDfile, setIDfile] = useState("")

  const params = useParams();

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
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
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

  /*const uploadFileToDB = e => {
    const file = e.target.files[0]
    console.log(file)
    CourseDataService.uploadCourse(file, params.id)
  }*/

  // handle click event of the upload button
  const handleOnSubmit = e => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('file',fileInput.current.files[0])
    alert(
      `Selected file - ${fileInput.current.files[0].name}`
    );
    setSelectedFile(fileInput.current.files[0])
    var data = {
      file: fileInput.current.files[0],
      studentID: params.id,
    };
    console.log(fileInput.current.files[0].length)
    console.log(fileInput.current.files[0].size)
    console.log(data.file)
    console.log(data.studentID);
    console.log(formData.get('file'))
  
    FileDataService.uploadFile(formData, data.studentID)
      .then(response => {
        setSubmitted(true);
        setDataCSV(response.data)
        console.log(response.data);
      })

    // fileID = getFile()
    console.log("dataCSV :")
    console.log(dataCSV)
    console.log("uploads/" + data.file.name)
    /*CourseDataService.uploadCourse("uploads/" +data.file.name, data.studentID)
      .then(response => {
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log("hey")
        console.log(e);
      });*/
    }

    const handleSubmitTest = event => {
      var fileInput = document.getElementById('csv');
      fileInput.addEventListener('change', function (event) {
      var csvInput = event.target;
      var file = csvInput.files[0];
      Papa.parse(file, {
        complete: function (results) {
          console.log(results.data); 
          // process the JSON
        }
      });
    });
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

  return (
    <form onSubmit={handleOnSubmit} encType='multipart/form-data'>
    <div>
      <h3>Upload grades student - SEC </h3>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        ref={fileInput}
        onChange={handleFileUpload}
      />
        <button
          className="btn btn-primary "
          type="submit"
        >
          Upload csv file
        </button>
      <Link to={"/students/"+params.id} className="btn btn-primary">
        View student visualisation
      </Link>
      <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </div>
    </form>     
  );
};
export default Downloadcsv;