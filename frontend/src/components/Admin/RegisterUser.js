import React, { useState, useEffect } from "react";
import AuthService from "../../services/authService";
import UserDataService from "../../services/userService"
import "../../styles/register.css"
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import validateSignUpForm from "./validate.js";
//const validateSignUpForm = FormValidators.validateSignUpForm;



const RegisterUser = props =>{
  
  var initalUserState ={
    user_id:"",
    username:"",
    password:"",
    mail:"",
    role:""
  }

  const [errors, setErrors] = useState({})
  const [user_id, setUserID] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mail, setMail] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState(false)
  const [content, setContent] = useState("");


  useEffect(() => {
    retrieveContent();
}, []);

  const retrieveContent = () => {
    UserDataService.getAdminBoard()
    .then(response => {
        console.log("response",response)
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

  const postUser = (data) => {
    AuthService.signUp(data)
    .then(response => {
      console.log("response.data",response);
      setMessage(true)
    })
    .catch(error => {
      (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
        setErrors({ message: error.response.data.error})
        console.log("errors catch",errors);
    });
  }

  async function handleRegister(e) {
    e.preventDefault();
    console.log("test")
    var data = {
        user_id,
        username,
        password,
        mail,
        role
    }
    var payload = validateSignUpForm(data)
    if (payload.success) {
      setErrors({});
      postUser(data)
    }

    else{
      const errors = payload.errors;
      setErrors(errors)
      console.log("payload",payload)
      console.log("errors",errors)
    }
    }


    function Copyright() {
      return (
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://material-ui.com/">
            Your Website
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      );
    }

    const useStyles = makeStyles(theme => ({
      paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
      },
      form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
      },
      submit: {
        margin: theme.spacing(3, 0, 2)
      }
    }));

    const classes = useStyles();

    return (
          <div>
          {!content ? (
          <form onSubmit={handleRegister} className={classes.form} noValidate>
            {!message && (
                <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Register user
                    {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}
                  </Typography>
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                    {!errors.user_id ? (
                        <TextField
                          autoComplete="fname"
                          name="userID"
                          variant="standard"
                          required
                          fullWidth
                          id="userID"
                          label="userID"
                          value={user_id}
                          onChange={onChangeUserID}
                          helperText={errors.user_id}
                          autoFocus
                        />
                        ):(
                          <TextField
                          error
                          autoComplete="fname"
                          name="userID"
                          variant="standard"
                          required
                          fullWidth
                          id="userID"
                          label="userID"
                          value={user_id}
                          onChange={onChangeUserID}
                          helperText={errors.user_id}
                          autoFocus
                        />
                        )}
                      </Grid>
                      <Grid item xs={12}>
                      {!errors.username ? (
                        <TextField
                          autoComplete="fname"
                          name="username"
                          variant="standard"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          value={username}
                          onChange={onChangeUsername}
                          autoFocus
                        />
                      ):(
                        <TextField
                        error
                        autoComplete="fname"
                        name="username"
                        variant="standard"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        value={username}
                        onChange={onChangeUsername}
                        helperText={errors.username}
                        autoFocus
                      /> 
                      )}
                      </Grid>
                      <Grid item xs={12}>
                      {!errors.password ? (
                        <TextField
                          variant="standard"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={onChangePassword}
                        />
                        ):(
                          <TextField
                          error
                          variant="standard"
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={onChangePassword}
                          helperText={errors.password}
                        />
                        )}
                      </Grid>
                      <Grid item xs={12}>
                      {!errors.mail ? (
                        <TextField
                          variant="standard"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          value={mail}
                          onChange={onChangeEmail}
                        />
                        ):(
                          <TextField
                          error
                          variant="standard"
                          required
                          fullWidth
                          id="email"
                          label="Email Address"
                          name="email"
                          autoComplete="email"
                          value={mail}
                          onChange={onChangeEmail}
                          helperText={errors.mail}
                        />
                        )
                        }
                      </Grid>
                      <Grid item xs={12}>
                      {!errors.mail ? (
                        <TextField
                          variant="standard"
                          required
                          fullWidth
                          name="role"
                          label="Role"
                          type="role"
                          id="role"
                          value={role}
                          onChange={onChangeRole}
                        />
                      ):(
                        <TextField
                          error
                          variant="standard"
                          required
                          fullWidth
                          name="role"
                          label="Role"
                          type="role"
                          id="role"
                          value={role}
                          onChange={onChangeRole}
                          helperText={errors.role}
                        />
                      )}
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Submit
                    </Button>
                </div>
                <Box mt={5}>
                  <Copyright />
                </Box>
              </Container>
              
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

  export default RegisterUser;