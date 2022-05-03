import React, { useState, useEffect } from "react";
import UserDataService from "../../services/userService";
import StudentDataService from "../../services/studentService";
import { Link } from "react-router-dom";

const SecretariatBoard = props => {

    const [students, setStudents] = useState([]);
    const [searchID, setSearchID ] = useState("");
    const [searchUnit, setSearchUnit ] = useState("");
    const [searchName, setSearchName ] = useState("");
    const [names, setNames] = useState(["All Names"]);
    const [content, setContent] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);
    
    const pages = new Array(numberOfPages).fill(null).map((v, i) => i);


    useEffect(() => {
        retrieveContent();
        retrieveStudents();
        retrieveNames();
    }, [pageNumber]);

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
        StudentDataService.getAll(pageNumber)
        .then(response => {
            console.log(response.data);
            console.log(pageNumber)
            setStudents(response.data.students); 
            setNumberOfPages(response.data.totalPages)
            console.log("students",students )
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
            console.log("names",names )
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

    const gotoNext = () => {
      setPageNumber(Math.min(numberOfPages - 1, pageNumber + 1));
    };

    const gotoPrevious = () => {
      setPageNumber(Math.max(0, pageNumber - 1));
    };

    return (  
    <div>
      {!content ? (
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
                     <option value={names}> {names} </option>
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
          {students.length ? (
            students.map((student) => {
              return (
                <div className="col-lg-4 pb-1">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{student.names}</h5>
                      <p className="card-text">
                        <strong>ID: </strong>{student.student_id}<br/>
                        <strong>Name: </strong>{student.name}<br/>
                        <strong>Average: </strong>{student.average}<br/>
                        <strong>Valid Units: </strong>{student.valideunits}
                      </p>
                      <div className="row">
                      <Link to={"/Downloadcsv/"+student._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                        View students
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
              ):(
              <div>
                <br />
                  <p>No students found</p>
              </div>
            )}

          </div>
          <nav aria-label="Page navigation example">
            <ul class="pagination">
              <li class="page-item">
                <button class="page-link" onClick={gotoPrevious}>Previous</button>
              </li>
              <li class="page-item">
                <button class="page-link" onClick={() => setPageNumber(0)}>1</button>
              </li>
              <li class="page-item">
                <button class="page-link" onClick={() => setPageNumber(1)}>2</button>
              </li>
              <li class="page-item">
                <button class="page-link" onClick={() => setPageNumber(2)}>3</button>
              </li>
              <li class="page-item">
                <button class="page-link" onClick={gotoNext}>Next</button>
              </li>
            </ul>
        </nav>        
        </div>
          ):(
          <div className="container">
            <header className="jumbotron">
              <h3>{content}</h3>
            </header>
          </div>
                    )}
        </div>    
      );

  }

export default SecretariatBoard;