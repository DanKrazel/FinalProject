import React, { useState, useEffect, useRef} from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddStudent from "./components/add-student";
import Student from "./components/students";
import StudentVisual from "./components/studentsVisual";
import DynamicVisualisation from "./components/DynamicVisualisation";

import StudentsList from "./components/students-list";
import Profil from "./components/profil"
import AuthService from "../src/services/authService"
import Downloadcsv from "./components/downloadcsv";
import Login from "./components/login";
import AdminBoard from "./components/Admin/adminBoard";
import ProfessorBoard from "./components/Professor/professorBoards";
import SecretariatBoard from "./components/Secretariat/secretariatBoard";
import RegisterUser from "./components/Admin/RegisterUser";
import ViewRequests from "./components/Secretariat/viewRequests";
import UploadCSVForProfessor from "./components/Secretariat/uploadCSVForProfessor";
import StudentSendProf from "./components/Secretariat/studentSendProf";
import UploadFiles from "./components/Secretariat/uploadFiles"
import dotenv from "dotenv"

import jwt from"jsonwebtoken"

//import { AuthContext } from "./components/context/authContext"

function App() {


  //const [user, setUser] = useState("")
  //const [currentUser, setCurrentUser] = useState(null)
  const [adminBoard , setAdminBoard ] = useState(false)
  const [secretariatBoard , setSecretariatBoard ] = useState(false)
  const [professorBoard , setProfessorBoard ] = useState(false)
  //const [token, setToken] = useState(false)
  const [roleSecretariat, setRoleSecretariat] = useState("")
  const [roleAdmin, setRoleAdmin] = useState("")
  const [roleProfessor, setRoleProfessor] = useState("")
  let navigate = useNavigate()
  const currentUser = AuthService.getCurrentUser();


  useEffect(() => {
    getBoard();
    //checkTokenIsExpire();
  }, [currentUser]);

  async function logout() {
    AuthService.logout()
    console.log("localStorage user :", localStorage.getItem('user'))
    //navigate('/login')
  }


  const getBoard = () => {
    if(currentUser){
      if(currentUser.role == 'Admin'){
        setAdminBoard(true)
      }else if(currentUser.role == 'Secretariat'){
        setSecretariatBoard(true)
      }else if(currentUser.role == 'Professor'){
        setProfessorBoard(true)
      }
    }

  }



  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
          Students List
      </Link>
          {adminBoard && (
          <div className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item active">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
              <li className="nav-item active">
                <Link to={"/signup"} className="nav-link">
                  Register users
                </Link>
              </li>
            </div>
              
          )}
          {secretariatBoard && (
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
                <Link to={"/uploadFiles"} className="nav-link">
                  Upload Files
                </Link>
              </li>
              <li className="nav-item active">
                <Link to={"/secretariat"} className="nav-link">
                  Secretariat Board
                </Link>
              </li>
            <li className="nav-item active">
              <Link to={"/view-requests"} className="nav-link">
                View requests
              </Link>
            </li>
          </div>
          )}
          {professorBoard && (
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <Link to={"/professor"} className="nav-link">
                Professor Board
              </Link>
            </li>
          </div>
        )}
          { currentUser ? (
          <div className="nav navbar-nav navbar-right">
            <li className="nav-item active">
                <Link to={"/profil"} className="nav-link">
                  Profil {currentUser.username}
                </Link>
            </li>
            <li className="nav-item active">
              <a href="/login" onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout
              </a>
            </li>
          </div>
          ) : (
          <div className="navbar-nav navbar-right">
            <li className="nav-item active">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>       
            </li>
          </div>
          
          )}
    </nav>

    <div className="container mt-3">
      <Routes>
        <Route
          path="/"
          element={<StudentsList/>} />
        <Route 
          path="/students/:id"
          element = { <Student user={currentUser}/> }
        />
        {/* <Route 
          path="/students/:name"
          element = { <Student user={currentUser}/> }
        /> */}
        <Route 
          path="/studentsVisual/:id"
            element={<StudentVisual user={currentUser}/> }
        />
          <Route
            path="/DynamicVisualisation/:id"
            element={<DynamicVisualisation user={currentUser} />}
          />
        <Route 
          path="/login"
          element = { <Login/> }
        />
        <Route 
          path="/signup"
          element = { <RegisterUser user={currentUser}/> }
        />
        <Route 
          path="/profil"
          element = { <Profil user={currentUser}/> } 
        />
        <Route 
          path="/admin"
          element = { <AdminBoard user={currentUser}/> } 
        />
        <Route 
          path="/professor"
          element = { <ProfessorBoard user={currentUser}/> } 
        />
        <Route 
          path="/secretariat"
          element = { <SecretariatBoard user={currentUser}/> } 
        />
        <Route 
          path="/view-requests"
          element = { <ViewRequests user={currentUser}/> } 
        />
        <Route 
          path="/uploadCSVForProfessor/:studentID/:professorID"
          element = { <UploadCSVForProfessor user={currentUser}/> } 
        />
        <Route 
          path="/studentSendProf/:studentID/:professorID"
          element = { <StudentSendProf user={currentUser}/> } 
        />
        <Route 
          path="/Downloadcsv/:id"
          element = { <Downloadcsv user={currentUser}/> } 
        />
        <Route 
          path="/uploadFiles"
          element = { <UploadFiles user={currentUser}/> } 
        />
        </Routes>
    </div>
  </div>
  );
}

export default App;