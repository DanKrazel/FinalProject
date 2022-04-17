import React, { useState, useEffect } from "react";
import AuthService from "../services/authService";


const Profil = props => {

    const [currentUser, setCurrentUser] = useState(props.user);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
      console.log("props.user",props.user)
    }, []);

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
      <ul class="list-group">
        <li class="list-group-item">
          <strong>Id:</strong>{" "}
          {currentUser.id}
        </li>
        <li class="list-group-item">
          <strong>Email:</strong>{" "}
          {currentUser.mail}
        </li>
        <li class="list-group-item">
          <strong>Roles:</strong>{" "}
          {currentUser.role}
        </li>
      </ul>
      </div>
    );
  }
  export default Profil;