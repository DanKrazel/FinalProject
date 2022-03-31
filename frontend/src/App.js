import React, { useState, useEffect, useRef} from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddStudent from "./components/add-student";
import Student from "./components/students";
import StudentsList from "./components/students-list";
import Profil from "./components/profil"
import AuthService from "../src/services/authService"
import Downloadcsv from "./components/downloadcsv";
import Login from "./components/login";
import AdminBoard from "./components/Boards/adminBoard";
import ProfessorBoard from "./components/Boards/professorBoards";
import SecretariatBoard from "./components/Boards/secretariatBoard";
import Flow from "./components/flowChart/testFlowChart";
import RegisterUser from "./components/Admin/RegisterUser";


function App() {

  const [user, setUser] = useState("")
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser())
  const [adminBoard , setAdminBoard ] = useState(false)
  const [secretariatBoard , setSecretariatBoard ] = useState(false)
  const [professorBoard , setProfessorBoard ] = useState(false)
  let navigate = useNavigate()


  useEffect(() => {
    getBoard();
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
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
          Students List
      </Link>
      <div className="navbar-nav mr-auto">
          {adminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
          )}
          {secretariatBoard && (
              <li className="nav-item">
                <Link to={"/secretariat"} className="nav-link">
                  Secretariat Board
                </Link>
              </li>
          )}
          {professorBoard && (
            <li className="nav-item">
              <Link to={"/professor"} className="nav-link">
                Professor Board
              </Link>
            </li>
        )}
        </div>
          { currentUser ? (
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
                <Link to={"/profil"} className="nav-link">
                  {currentUser.username}
                </Link>
            </li>
            <li className="nav-item">
              <a href="/login" onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout
              </a>
            </li>
          </div>
          ) : (
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
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
        <Route 
          path="/login"
          element = { <Login/> }
        />
        <Route 
          path="/signup"
          element = { <RegisterUser/> }
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
          path="/Downloadcsv/:id"
          element = { <Downloadcsv user={currentUser}/> } 
        />
        </Routes>
    </div>
  </div>
  );
}

export default App;