import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import UserDataService from "../../services/userService";
import RequestDataService from "../../services/requestsService"
import StudentDataService from "../../services/studentService";



const ViewRequests = props => {

   const [content, setContent] = useState("");
   const [requests, setRequests] = useState([]);
   const [students, setStudents] = useState([]);
   const [refreshKey, setRefreshKey] = useState(0);

   let navigate = useNavigate()
    
//   constructor(props) {
//     super(props);
//     this.state = {
//       content: ""
//     };
//   }

    useEffect(() => {
        retrieveContent();
        retrieveStudents();
        //retrieveRequests();
        retrieveStudentByRequest();
        //retrieveProfessorByRequest();
    }, [refreshKey]);

    const retrieveContent = () => {
      UserDataService.getSecretariatBoard()
        .then(response => {
        console.log("response",response)
        //setContent(response.data)
        })
        .catch(error => {
          console.log("errooor",error)
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
            console.log("requests",response.data.requests);
            setRequests(response.data.requests); 
            //console.log("requests",requests )
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

    // const getStudentByID = (query,by) => {
    //   StudentDataService.find(query, by)
    //   .then(response => {
    //     console.log("find",response.data);
    //     setStudents(response.data.students);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
    // }

    const retrieveStudentByRequest = () => {
        RequestDataService.retrieveStudentByRequest()
          .then(response => {
            console.log("requests",response.data);
            setRequests(response.data); 
          })
          .catch(e => {
            console.log(e);
          });
      };

      const retrieveProfessorByRequest = () => {
        RequestDataService.retrieveProfessorByRequest()
          .then(response => {
            console.log("requests",response.data);
            setRequests(response.data); 
          })
          .catch(e => {
            console.log(e);
          });
      };

      const deleteRequest = (requestID) => {
        console.log("check", requestID)
        RequestDataService.deleteRequest(requestID)
          .then(response => {
            console.log(response.data);
            setRefreshKey(oldKey => oldKey +1)

          })
          .catch(e => {
            console.log(e);
          });
      };

    const sendVisualisation = (id) => {
      navigate(`/Downloadcsv/${id}`)
    }
    var counter  =0;
    return (
      
    <div>
        {!content ? (
       
        <div>
        <h1>???? ???????????? ????????????</h1> 
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
       
                    <th scope="col">????????</th>
                    <th scope="col">???????????? ????</th>
                    <th scope="col">???????????? ????</th>
                    <th scope="col">??????????</th>
                    <th scope="col">??????????</th>
                </tr>
            </thead>
        <tbody>
        {requests.map((request,i) => {
            return (
                <tr key={request._id}>
                    <th scope="row">{i+1}</th>
    
                    <td>{request.sender}</td>
                    <td>{request.student[0].student_id}</td>
                    <td>{request.student[0].name}</td>
                    <td>
                        <Link to={"/studentSendProf/"+request.student[0]._id+"/"+request.professor[0]._id} className="btn btn-primary col-8">
                            Send vizualisation of {request.student[0].name} to {request.sender}
                        </Link>
                    </td>
                    <td>
                        <button className="btn btn-primary" onClick={() => deleteRequest(request._id)}>
                            ?????????? ????????
                        </button>
                    </td>
                </tr>
            );
        })}
        </tbody>
        </table>
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


export default ViewRequests;