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
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p>
        <p>
          <strong>Id:</strong>{" "}
          {currentUser.id}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUser.mail}
        </p>
        <p>
          <strong>Roles:</strong>{" "}
          {currentUser.role}
        </p>
      </div>
    );
  }
  export default Profil;