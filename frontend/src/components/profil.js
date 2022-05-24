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
            <strong>{currentUser.username}</strong> פרופיל
          </h3>
        </header>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>ת.זהות:</strong>{" "}
          {currentUser.user_id}
        </li>
        <li className="list-group-item">
          {currentUser.username}  
          <strong> :שם משתמש</strong>{" "}
        </li>
        <li className="list-group-item">
          {currentUser.mail}
          <strong> :מייל</strong>{" "}
        </li>
        <li className="list-group-item">
          {currentUser.role}
          <strong> :תפקיד</strong>{" "}
        </li>
      </ul>
      </div>
    );
  }
  export default Profil;