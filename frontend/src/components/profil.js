import React, { useState, useEffect } from "react";
import AuthService from "../services/authService";


const Profil = props => {

    const [currentUser, setCurrentUser] = useState(props.user);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
    }, []);

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Id:</strong>{" "}
          {currentUser.user_id}
        </li>
        <li className="list-group-item">
          <strong>Username:</strong>{" "}
          {currentUser.username}
        </li>
        <li className="list-group-item">
          <strong>Email:</strong>{" "}
          {currentUser.mail}
        </li>
        <li className="list-group-item">
          <strong>Roles:</strong>{" "}
          {currentUser.role}
        </li>
      </ul>
      </div>
    );
  }
  export default Profil;