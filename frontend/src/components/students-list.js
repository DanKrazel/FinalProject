import React, { useState, useEffect } from "react";
import StudentDataService from "../services/studentService";
import { Link } from "react-router-dom";

const StudentsList = props => {
  const [students, setStudents] = useState([]);
  const [searchID, setSearchID ] = useState("");
  const [searchUnit, setSearchUnit ] = useState("");
  const [searchName, setSearchName ] = useState("");
  const [names, setNames] = useState(["All Names"]);
  
  useEffect(() => {
    retrieveStudents();
    retrieveNames();
  }, []);

  const onChangeSearchID = e => {
    const searchID = e.target.value;
    setSearchID(searchID);
  };

  const onChangeSearchUnits = e => {
    const searchUnit = e.target.value;
    setSearchUnit(searchUnit);
  };

  const onChangeSearchNames = e => {
    const searchNames = e.target.value;
    setSearchName(searchNames);
    
  };

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

  const retrieveNames = () => {
    StudentDataService.getNames()
      .then(response => {
        console.log(response.data);
        setNames(["All Names"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveStudents();
  };

  const find = (query, by) => {
    StudentDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setStudents(response.data.students);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByID = () => {
    find(searchID, "student_id")
  };

  const findByUnit = () => {
    find(searchUnit, "unit")
  };

  const findByName = () => {
    if (searchName === "All Names") {
      refreshList();
    } else {
      find(searchName, "name")
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchNames}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID"
            value={searchID}
            onChange={onChangeSearchID}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByID}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">

          <select onChange={onChangeSearchNames}>
             {names.map(names => {
               return (
                 <option value={names}> {names.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {students.map((student) => {
          if(student.totalunits!=0){
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{student.names}</h5>
                  <p className="card-text">
                    <strong>ID: </strong>{student.student_id}<br/>
                    <strong>Name: </strong>{student.name}<br/>
                    <strong>Average: </strong>{Math.round((student.average/student.totalunits) * 100) / 100}<br/>
                    <strong>Total Units: </strong>{student.totalunits}<br/>
                    <strong>Valide Units: </strong>{student.valideunits}
                  </p>
                  <div className="row">
                  <Link to={"/Downloadcsv/"+student._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Students
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }else{
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{student.names}</h5>
                  <p className="card-text">
                    <strong>ID: </strong>{student.student_id}<br/>
                    <strong>Name: </strong>{student.name}<br/>
                    <strong>Average: </strong>{student.average}<br/>
                    <strong>Total Units: </strong>{student.totalunits}<br/>
                    <strong>Valide Units: </strong>{student.valideunits}
                  </p>
                  <div className="row">
                  <Link to={"/Downloadcsv/"+student._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Students
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        })}


      </div>
    </div>
  );
};

export default StudentsList;