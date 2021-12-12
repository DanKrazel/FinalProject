import React, { useState, useEffect } from "react";
import UserDataService from "../services/userService";

const Login = props => {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    retrieveUsers();
  }, []);


  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const retrieveUsers = () => {
    UserDataService.getAll()
      .then(response => {
        console.log(response.data);
        setUsers(response.data.users); 
      })
      .catch(e => {
        console.log(e);
      });
  };


  async function loginUser(event){
    event.preventDefault()
    const data = {username,password}
    const response = await UserDataService.checkAuthentification(data)
    if(response.data.status == "success"){
      alert('Login successful')
      setUser(data);
      props.login(user)
      window.location.href = '/'
    }else {
			alert('Please check your username and password')
		}
    
    console.log(response.data.status)
  }

 /* function validateForm() {
    return username.length > 0 && password.length > 0;
  }*/

  const onChangeUsername = e => {
    const Username = e.target.value;
    setUsername(Username);
  };

  const onChangePassword = e => {
    const Password = e.target.value;
    setPassword(Password);
  };

  
  const findByUsername = () => {
    find(username, "username")
  };

  const findByPassword = () => {
    find(password, "password")
  };
  

  const find = (query, by) => {
    UserDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setUsers(response.data.users);
      })
      .catch(e => {
        console.log(e);
      });
  };

  /*const login = () => {
    props.login(user)
    //props.history.push('/');
  }*/

    return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            required
            value={username}
            onChange={onChangeUsername}
            name="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            required
            value={password}
            onChange={onChangePassword}
            name="password"
          />
        </div>

        <button onClick={loginUser} className="btn btn-success" >
          Login
        </button>
      </div>
    </div>
    );
};

export default Login;