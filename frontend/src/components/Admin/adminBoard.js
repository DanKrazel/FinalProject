import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import UserDataService from "../../services/userService";
import RequestDataService from "../../services/requestsService"
import StudentDataService from "../../services/studentService";


const AdminBoard = props => {

   const [content, setContent] = useState("");
   const [users, setUsers] = useState([]);
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
        retrieveUsers();
    }, [refreshKey]);

    const retrieveContent = () => {
      UserDataService.getAdminBoard()
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

    const retrieveUsers = () => {
      UserDataService.getAll()
          .then(response => {
            console.log("users",response.data.users);
            setUsers(response.data.users); 
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



      const deleteUser = (userID) => {
        console.log("check", userID)
        UserDataService.deleteUser(userID)
          .then(response => {
            console.log(response.data);
            setRefreshKey(oldKey => oldKey +1)

          })
          .catch(e => {
            console.log(e);
          });
      };

    return (
    <div>
        {!content ? (
        <div>
        <h1>Users table </h1> 
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">UserID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Delete</th>
                </tr>
            </thead>
        <tbody>
        {users.map((users,i) => {
            return (
                <tr key={users._id}>
                    <th scope="row">{i+1}</th>
                    <td>{users.user_id}</td>
                    <td>{users.username}</td>
                    <td>{users.mail}</td>
                    <td>{users.role}</td>
                    <td>
                        <button className="btn btn-primary" onClick={()=>deleteUser(users._id)}>
                            Delete user
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


export default AdminBoard;