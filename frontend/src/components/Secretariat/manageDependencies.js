import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import UserDataService from "../../services/userService";
import DependenciesDataService from "../../services/dependenciesService"



const ManageDependencies = props => {

   const [content, setContent] = useState("");
   const [dependencies, setDependencies] = useState([]);
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
        retrieveDependencies();
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

    const retrieveDependencies = () => {
        DependenciesDataService.getAll()
          .then(response => {
            console.log("dependencies",response.data);
            setDependencies(response.data.dependencies); 
          })
          .catch(e => {
            console.log(e);
          });
      };

      const deleteDependency = (id) => {
        console.log("check", id)
        DependenciesDataService.deleteDependency(id)
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
        <h1>תלויות
          </h1> 
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>    
                    <th scope="col">קורס קדם</th>
                    <th scope="col">קורס</th>
                    <th scope="col">למחוק</th>
                </tr>
            </thead>
        <tbody>
        {dependencies.map((dependency,i) => {
            return (
                <tr key={dependency._id}>
                    <th scope="row">{i+1}</th>   
                    <td>{dependency.StartCoursesname}</td>
                    <td>{dependency.EndCoursesname}</td>
                    <td>
                      
                        <button className="btn btn-primary" onClick={() => deleteDependency(dependency._id)}>
                            למחוק תלויה
                        </button>
                    </td>
                </tr>
            );
        })}
        </tbody>
        </table>
        <button class="btn btn-primary" onClick={() => navigate(-1)} >
              לחזור לדף הקודם
        </button>
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


export default ManageDependencies;