import React, { useState, useEffect } from "react";
import UserDataService from "../../services/userService";

const AdminBoard = props => {

   const [content, setContent] = useState("");
    
//   constructor(props) {
//     super(props);
//     this.state = {
//       content: ""
//     };
//   }

    useEffect(() => {
        retrieveContent();
    }, []);

    const retrieveContent = () => {
      UserDataService.getAdminBoard()
        .then(response => {
        console.log("response",response)
        setContent(response.data)
        })
        .catch(error => {
          setContent((error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString())
      });  
    }

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
      </div>
    );
  }


export default AdminBoard;