import React, { useState, useEffect} from "react";
import StudentDataService from "../services/studentService";
import { useParams  } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { ArcherContainer, ArcherElement } from 'react-archer';
import styled from 'styled-components'
import { useTable, useBlockLayout, useResizeColumns } from 'react-table'



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

    export const columns = [
      {
          Header: "Date",
          accessor: "date",
        },

      {
          Header: "Name",
          accessor: "user",
      },

      {
          Header: "Amount",
          accessor: "amount",
      },

      {
          Header: "Category",
          accessor: "category",
      },

      {
          Header: "Status",
          accessor: "status",
          }
      }
  ]
  
  function Table({ columns, data }) {
      // Use the state and functions returned from useTable to build your UI
      const {
          getTableProps,
          getTableBodyProps,
          headerGroups,
          rows,
          prepareRow,
      } = useTable({
          columns,
          data,
      })
  
      // Render the UI for your table
      return (
          <table {...getTableProps()}>
  
              <thead>
                  {headerGroups[1].headers.map(column => (
                      <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                  {rows.map(
                      (row, i) => {
                          prepareRow(row);
                          return (
                              <tr {...row.getRowProps()}>
                                  {row.cells.map(cell => {
                                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                  })}
                              </tr>
                          )
                      }
                  )}
              </tbody>
          </table>
      )
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
          <div className="col-sm text-center bg-white" >    
            Year 1     
          </div>  
           <div className="row">
            {student.courses.length > 0 ? (
             student.courses.map((course) => {  
              return (
                <Styles>
                    <Table columns={[1,2,3,4,5,6]} data={course} />
                </Styles>
            )
        
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

