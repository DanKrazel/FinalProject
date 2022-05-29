import React, { useState, useEffect, useRef} from "react";
import UserDataService from "../services/userService";
import AuthService from "../services/authService";
import { useNavigate } from "react-router-dom";



const Login = props => {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  let navigate = useNavigate()

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


  async function handleLogin(event){
    event.preventDefault()
    const data = {username,password}
    const response = await AuthService.login(data)
    console.log("response.data.login",response.data)
    if(response.status == "success"){
      //alert('Login successful')
      setUser(data);
      //props.login(user)
      navigate('/profil', { replace: true })
      alert('להכנס')

    }
    else {
			alert('לבדוק שוב שם וסיסמה בבקשה')
		}
    
    console.log(response.status)
  // do something when no error
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
      <div>
      <form class="needs-validation"  onSubmit={handleLogin} novalidate>
        <div className="form-group">
          <label for="validationCustomUsername">שם משתמש</label>
          <input
            type="text"
            class="form-control"
            placeholder="Username"
            value={username}
            onChange={onChangeUsername}
            name="username"
            id="validationCustomUsername"
            required
          />
          <div class="invalid-feedback">
          Please choose a username.
          </div>
        </div>

        <div className="form-group">
          <label for="validationCustom02">סיסמה</label>
          <input
            type="password"
            className="form-control"
            id="validationCustom02"
            placeholder="Password"
            required
            value={password}
            onChange={onChangePassword}
            name="password"
          />
        </div>
        <div class="invalid-feedback">
          Please choose a password
        </div>

        <button type="submit" className="btn btn-success" >
          להתחבר
        </button>
        </form>
      </div>
    );
};

export default Login;