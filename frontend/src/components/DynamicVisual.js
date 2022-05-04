import React, { useState, useEffect, useRef } from "react";
import StudentDataService from "../services/studentService";
import UnitsBySemesterDataService from "../services/unitsBySemesterService";
import { useParams, useNavigate } from "react-router-dom";
/**import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';*/
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Link } from "react-router-dom";
import "../App.css";
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { ReactComponent as HeadSvg } from "../assets/arrowHead-resize.svg";
import DependenciesDataService from "../services/dependencieService"

const DynamicVisual = props => {
  var arrayCourses = ['חדו"א  - 1', 'אלגברה לינארית לתוכנה-ה', 'לוגיקה ונושאים דיסקרטיים I', 'I ארכיטקטורת מחשבים', 'מבוא למדעי המחשב', 'חדוא 2 להנדסת תוכנה',
    'פיסיקה להנדסת תוכנה', 'לוגיקה ונושאים דיסקרטיים II', 'לוגיקה ונושאים דיסקרטיים II', 'תכנות מונחה עצמים', 'מבוא להסתברות וסטטיסטיקה', 'מבוא להסתברות וסטטיסטיקה',
    'יסודות הנדסת תוכנה', 'מבנה נתונים-ה', 'עקרונות שפות תוכנה', 'בדיקות ואיכות בהנדסת תוכנה', 'הנדסת דרישות וניתוח תוכנה', 'אנגלית מדוברת', 'אוטומטים ושפות פורמאליות',
    'אלגורתמים I', 'מבוא לתקשורת מחשבים', 'אנליזה נומרית', 'רשתות תקשורת מחשבים', 'אבטחת נתונים', 'עיבוד תמונה וראייה ממוחשבת', 'בטיחות תוכנה']
  const initialStudentState = {
    student_id: null,
    name: "",
    average: "",
    valideunits: "",
    totalunits: "",
    semester: "",
    years: "",
    courses: []
  };
  const params = useParams();
  const [dependencies, setDependencies]= useState([]);
  
  const [student, setStudent] = useState(initialStudentState);
  const [unitsBySemester, setUnitsBySemester] = useState([])
  var countUnitSemesters = 0;
  const pdfExportComponent = React.useRef(null);
  const refs = useRef([])

  useEffect(() => {
    retrieveDependencies();
    console.log("useEffect student")
    getStudent(params.id);
    getUnitsBySemester(params.id);
    updateTotalUnitForEachSemester();
}, []);

  const updateTotalUnitForEachSemester = () => {
    for (let i = 0; i < unitsBySemester.length; i++) {
      if (unitsBySemester[i].yearOfLearning == 'א') {
        if (unitsBySemester[i].semesterOfLearning == 'א') {
          countUnitSemesters = unitsBySemester[i].units
        }
        if (unitsBySemester[i].semesterOfLearning == 'ב') {
          console.log("update");
          var data = {
            yearOfLearning: unitsBySemester[i].yearOfLearning,
            semesterOfLearning: unitsBySemester[i].semesterOfLearning,
            units: unitsBySemester[i].units + countUnitSemesters,
            studentID: params.id
          }
          UnitsBySemesterDataService.updateUnitsBySemester(data)
            .then(response => {
              console.log(response.data);
              console.log("update");
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    }
  }

  const getStudent = (id) => {
    StudentDataService.findStudent(id)
      .then(response => {
        StudentDataService.getCoursesByStudentName(response.data.name).then(response => {
          console.log('response.data', response.data)
          setStudent(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      })
      .catch(e => {
        console.log(e);
      });
  };
  
  const getUnitsBySemester = (id) => {
    UnitsBySemesterDataService.findUnitsBySemester(id)
      .then(response => {
        setUnitsBySemester(response.data.unitsBySemester);
        console.log(response.data.unitsBySemester);
        console.log("unitsBySemester", unitsBySemester);
      })
      .catch(e => {
        console.log(e);
      });
  };

  function getKeyByValue(object, key) {
    console.log(Object.keys(object).find(value => object[key] === value));
    return Object.keys(object).find(value => object[key] === value);
  }

  function orderarray(dependencies) {
    var k = 'box';
    var i = 0;
   
    var k = 0;
    var p = dependencies.length;
    const options = []
    for (var i = 0; i < dependencies.length; i++) {
      var dict = {
        value: dependencies[i].StartCoursesname, label: null
      }
      options.push(dict);
    }
    console.log(options);
    return options
   
  }


  const retrieveDependencies = () => {
    DependenciesDataService.getAll()
      .then(response => {
        console.log(response.data);
        setDependencies(response.data.dependencies);
        console.log("Dependency", dependencies);
      })
      .catch(e => {
        console.log(e);
      });
  };

 // console.log(refs.current);
  //console.log(refs.current.find(({ key }) => key === 'חדו"א  - 1'));

  const startf = (dependencies.map(function (a) { return a.StartCoursesname; }));
  const endf= (dependencies.map(function (a) { return a.EndCoursesname; }));
  let zipped = startf.map((x, i) => [x, endf[i]]);
  console.log(zipped[0]);
  return (
    <><div className="card text-center ">
    </div> <div className="row">

        {zipped.map((dependency,index) => {
            return (
              <><div className="col-lg-4 pb-1">
                <div className="card">
                  <div className="card-body" key={index} id={dependency.start}  >
                    <h5 className="card-title">{dependency.id}</h5>
                    <p className="card-text">
                      <strong>Name: </strong>{dependency}<br />
                    </p>                
                  </div>


                  {

                    <Xarrow curveness={0} path="grid" strokeWidth={3} headShape={{ svgElem: <HeadSvg />, offsetForward: 1 }}
                      startAnchor={'lebottomft'}
                      start={dependency[0]}  //can be react ref
                      end={dependency[1]} //or an id
                    />
                  }
                </div>
              </div></>
            );
         
        }
        
        
        )}

        <div>
          <PDFExport ref={pdfExportComponent} paperSize="auto" margin={40} fileName={`Report for ${new Date().getFullYear()}`} author="KendoReact Team">
            {student ? (
              <div>
                <h5>{student.name}</h5>
                {(() => {
                  if ((student.average < 60) || (student.years === 'ב' && student.totalunits < 36) || ((student.years === 'ג' && student.totalunits < 75)) || ((student.years === 'ד' && student.totalunits < 115))) {
                    return (
                      <p>
                        <div className="col-sm1 text-white bg-secondary w-40 l-20">
                          <strong> ת״ז: </strong>{student.student_id}
                          <strong> | ממוצע: </strong>{student.average}
                          <strong> | שנה: </strong>{student.years}
                          <strong> | נק״ז: </strong>{student.totalunits}
                          <strong> | נק״ז: </strong>{student.valideunits}

                        </div>
                      </p>
                    );
                  } else {
                    return (
                      <p>
                        <div className="col-sm1 text-white bg-secondary w-40 l-20">
                          <strong> ת״ז: </strong>{student.student_id}
                          <strong> | ממוצע: </strong>{student.average}
                          <strong> | שנה: </strong>{student.years}
                          <strong> | נק״ז כללי: </strong>{student.totalunits}
                          <strong> | נק״ז עובר: </strong>{student.valideunits}
                          <strong class=" d-block  ml-auto mr-o "> תקין </strong>
                          <Link to={"/students/" + student._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                            View Students
                          </Link>
                          <br />
                        </div>
                      </p>
                    );
                  }
                })()}
                <div className="card text-center ">
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
        <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            <div>
            </div>
          </div>

        <div className="col-sm text-white ">
          <div className="card my-3 " id={'חדו"א  - 1'}>
            <p className='bg-secondary text-white text-center'>
              <h11>
                חדו"א  - 1<br />
                None <br />
                5 <br />
              </h11>
            </p>
          </div>
        </div>
          <div className="col-sm text-white ">
            <div className="card my-3 " id={'לוגיקה ונושאים דיסקרטיים I'}>
              <p className='bg-secondary text-white text-center'>
                <h11>
                  לוגיקה ונושאים דיסקרטיים I<br />
                  None <br />
                  5 <br />
                </h11>
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm  rounded-round   my-auto  text-center  bg-warning  ">
            <div>
            </div>
          </div>

          <div className="col-sm text-white ">
            <div className="card my-3 " id={'חדוא 2 להנדסת תוכנה'}>
              <p className='bg-secondary text-white text-center'>
                <h11>
                  חדוא 2 להנדסת תוכנה<br />
                  None <br />
                  5 <br />
                </h11>
              </p>
            </div>
          </div>
          <div className="col-sm text-white ">
            <div className="card my-3 " id={'לוגיקה ונושאים דיסקרטיים II'}>
              <p className='bg-secondary text-white text-center'>
                <h11>
                  לוגיקה ונושאים דיסקרטיים II<br />
                  None <br />
                  5 <br />
                </h11>
              </p>
            </div>
          </div>
        </div>


      </div></>

      
  );


};
export default DynamicVisual;

