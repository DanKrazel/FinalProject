import React, { useState } from "react";
import AuthService from "../../services/authService";
import "../../App.css"


const RegisterUser = props =>{
  

  const [user_id, setUserID] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mail, setMail] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState(false)

  const onChangeUserID = (e) => {
    setUserID(e.target.value)
  }

  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }
  const onChangeEmail = (e) => {
    setMail(e.target.value)
  }
  const onChangePassword = (e) => {
    setPassword(e.target.value)
  } 
  const onChangeRole = (e) => {
    setRole(e.target.value)
  }

  async function handleRegister(e) {
    e.preventDefault();
    var data = {
        user_id,
        username,
        password,
        mail,
        role
    }
    AuthService.signUp(data)
    .then(response => {
        console.log(response.data);
        setMessage(true)
    })
    .catch(error => {
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      });
    }

    return (
          <form onSubmit={handleRegister}>
            {!message && (
            <div className="card card-container">
                <div className="form-group">
                <label for="validationCustom02">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustom02"
                    name="user_id"
                    value={user_id}
                    onChange={onChangeUserID}
                    placeholder="ID..."
                  />
                </div>
                <div className="form-group">
                  <label for="validationCustom02">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    id="validationCustom02"
                    value={username}
                    onChange={onChangeUsername}
                    placeholder="Username..."
                  />
                </div>
                <div className="form-group">
                  <label for="validationCustom02">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="validationCustom02"
                    value={password}
                    onChange={onChangePassword}
                    placeholder="Password..."
                  />
                </div>
                <div className="form-group">
                  <label for="validationCustom02">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="validationCustom02"
                    value={mail}
                    onChange={onChangeEmail}
                    placeholder="Email..."
                  />
                </div>
                <div className="form-group">
                  <label for="validationCustom02">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    name="role"
                    id="validationCustom02"
                    value={role}
                    onChange={onChangeRole}
                    placeholder="Role..."
                  />
                </div>
                <div class="form-check">
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="submit">Sign Up</button>
                </div>
                </div>
            )}
            {message && (
              <div className="form-group">
                <div
                  className={
                    message
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {message}
                </div>
              </div>
            )}

          </form>
    );
  }

  export default RegisterUser;