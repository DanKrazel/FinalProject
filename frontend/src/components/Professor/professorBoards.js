import React, { useState, useEffect } from "react";
import UserDataService from "../../services/userService";
import StudentDataService from "../../services/studentService";
import RequestDataService from "../../services/requestsService"

const ProfessorBoard = props => {

    const initialRequestSent = [];
    var index = 0;



    const [students, setStudents] = useState([]);
    const [searchID, setSearchID ] = useState("");
    const [searchName, setSearchName ] = useState("");
    const [names, setNames] = useState(["All Names"]);
    const [content, setContent] = useState("");
    const [requests, setRequests] = useState([])
    const [currentUser, setCurrentUser] = useState(props.user);
    const [requestSent, setRequestSent] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);
    const [numberOfPages, setNumberOfPages] = useState(0);



    useEffect(() => {
        retrieveContent();
        retrieveStudents();
        retrieveNames();
        retrieveRequests();
        //defineRequestSent();
        //console.log("requestSentEffect",requestSent)
    }, [refreshKey,pageNumber]);

    const retrieveContent = () => {
        UserDataService.getProfessorBoard()
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

    const onChangeSearchNames = e => {
        const searchNames = e.target.value;
        setSearchName(searchNames);
    };

    const retrieveStudents = () => {
        StudentDataService.getAll(pageNumber)
        .then(response => {
            console.log(response.data);
            setStudents(response.data.students); 
            setNumberOfPages(response.data.totalPages)
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



  const handleSendRequests = (event, index) => {
    event.preventDefault()
    var studentID = students[index]._id
    console.log("testRequest")
    console.log(currentUser.username)
    console.log(students)
    var dataRequest = {
      sender:currentUser.username,
      receiver:"Regina",
      studentID:studentID
    }
    //getRequestSent(dataRequest)
    console.log("requestSentHandle",requestSent)
    RequestDataService.postRequest(dataRequest)
    .then(response => {
        console.log("postRequest",response)
        setRefreshKey(oldKey => oldKey +1)
    }) 
    .catch(error => {
        console.log(error)
    });
  }

  const retrieveRequests = () => {
    RequestDataService.getAll()
      .then(response => {
        console.log("requests",response.data.requests);
        setRequests(response.data.requests); 
        //console.log("requests",requests )
      })
      .catch(e => {
        console.log(e);
      });
  };

  const renderButtonsSentOrView = (requests,student,i) => {
    let content = <form onSubmit={event => handleSendRequests(event, i)}>
                  <button type="submit" className="btn btn-primary col-lg-5 mx-1 mb-1">
                    Send a view request to Regina
                  </button> 
                  </form>;
    for(let i = 0; i<requests.length; i++){
      if(requests[i].studentID == student._id ){
          content = <div className="btn btn-success col-lg-5 mx-1 mb-1">
              Request sent !
            </div>
        break;
      }
    }
    return content;
  }

    



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
            {students.map((student,i) => {
              return (
                <div className="col-lg-4 pb-1 " key={student._id}>
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
                      {renderButtonsSentOrView(requests, student, i)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })};
    
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

export default ProfessorBoard;