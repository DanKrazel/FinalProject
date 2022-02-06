import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddStudent from "./components/add-student";
import Student from "./components/students";
import StudentsList from "./components/students-list";
import Downloadcsv from "./components/downloadcsv";
import Login from "./components/login";
import student from "./services/studentService";


function App() {
  const [user, setUser] = React.useState(null)

  async function login(user = null){
    setUser(user)
  }

  async function logout() {
    setUser(null)
  }

  return (
    <div>
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" className="navbar-brand">
          Students List
      </a>
      <div className="navbar-nav mr-auto">
        <li className="nav-item" >
          { user ? (
            <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
              Logout {user.name}
            </a>
          ) : (            
          <Link to={"/login"} className="nav-link">
            Login
          </Link>
          )}

        </li>
      </div>
    </nav>

    <div className="container mt-3">
      <Routes>
        <Route
          path="/"
          element={<StudentsList/>} />
        <Route 
          path="/students/:id/review"
          element = { <AddStudent user={user} /> }
        />
        <Route 
          path="/students/:id"
          element = { <Student user={user}/> }
        />
        <Route 
          path="/login"
          element = { <Login login={login} /> }
        />
         <Route 
          path="/Downloadcsv/:id"
          element = { <Downloadcsv user={user}/> } />
          </Routes>
    </div>
  </div>
  );
}

export default App;