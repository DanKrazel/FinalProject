import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import UserDataService from "../../services/userService";
import RequestDataService from "../../services/requestsService"
import StudentDataService from "../../services/studentService";
import ImageVisualizationService from "../../services/imageVisualizationService";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import "../../styles/uploadFiles.css";
import { v4 as uuidv4 } from 'uuid'
import html2canvas from "html2canvas"




const ViewListVisualisation = props => {

   const [content, setContent] = useState("");
   const [visualisations, setVisualisations] = useState([]);
   const [requests, setRequests] = useState([]);
   const [students, setStudents] = useState([]);
   const [imageVisualization, setImageVizualisation] = useState([])
   const [refreshKey, setRefreshKey] = useState(0);
   const [searchID, setSearchID ] = useState("");
   const [searchName, setSearchName ] = useState("");
   const [names, setNames] = useState(["כל השמות"]);

   let navigate = useNavigate()
    
//   constructor(props) {
//     super(props);
//     this.state = {
//       content: ""
//     };
//   }

    useEffect(() => {
        retrieveContent();
        retrieveStudents();
        retrieveImageVisualisation();
        retrieveStudentByRequest();
        getUser(props.user)
        //retrieveProfessorByRequest();
    }, [refreshKey]);

    const retrieveContent = () => {
      UserDataService.getProfessorBoard()
        .then(response => {
        console.log("response",response)
        //setContent(response.data)
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

    const getUser = (id) => {
      UserDataService.find("_id",id)
        .then(response => {
        console.log("responseUserID",response)
        //setContent(response.data)
        })
        .catch(error => {
          console.log(error)
      });  
    }

    const retrieveImageVisualisation = () => {
      ImageVisualizationService.getAll()
          .then(response => {
            console.log("ImageVisualization",response.data);
            setImageVizualisation(response.data.imageVisualization); 
            //console.log("requests",requests )
          })
          .catch(e => {
            console.log(e);
          });
      };

    const retrieveStudents = () => {
        StudentDataService.getAll()
        .then(response => {
            console.log(response.data);
            setStudents(response.data.students); 
            console.log("students",students )
        })
        .catch(e => {
        console.log(e);
        });
    };

    // const getStudentByID = (query,by) => {
    //   StudentDataService.find(query, by)
    //   .then(response => {
    //     console.log("find",response.data);
    //     setStudents(response.data.students);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
    // }

    const retrieveStudentByRequest = () => {
        RequestDataService.retrieveStudentByRequest()
          .then(response => {
            console.log("requests",response.data);
            setRequests(response.data); 
          })
          .catch(e => {
            console.log(e);
          });
      };

      const retrieveProfessorByRequest = () => {
        RequestDataService.retrieveProfessorByRequest()
          .then(response => {
            console.log("requests",response.data);
            setRequests(response.data); 
          })
          .catch(e => {
            console.log(e);
          });
      };

      const deleteImageVisualisation = (id) => {
        console.log("check", id)
        ImageVisualizationService.deleteImageVisualisation(id)
          .then(response => {
            console.log(response.data);
            setRefreshKey(oldKey => oldKey +1)

          })
          .catch(e => {
            console.log(e);
          });
      };

  
    const exportImage = (id,nameFile) => {
      html2canvas(document.querySelector(id), {allowTaint: true})
      .then(canvas => {
        //document.body.appendChild(canvas)
        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = nameFile;
        link.href = canvas.toDataURL();
        link.target = '_blank';
        link.click();
    })
  }

    const find = (query, by) => {
      ImageVisualizationService.find(query, by)
      .then(response => {
        console.log(response.data);
        setStudents(response.data.students);
      })
      .catch(e => {
        console.log(e);
      });
    };

    const findByID = () => {
      find(searchID, "studentID")
    };


    const onChangeSearchID = e => {
      const searchID = e.target.value;
      setSearchID(searchID);
    };

    return (
    <div>
        {!content ? (
        <div>
        <h1>צפייות מרגינה</h1> 
        <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="חפש לפי תעודת זהות של הסטודנט"
              value={searchID}
              onChange={onChangeSearchID}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByID}
              >
                חפש
              </button>
            </div>
               
          </div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">צפייה מספר</th>
                    <th scope="col">שליח</th>
                    <th scope="col">תז של הסטודנט</th>
                    <th scope="col">צפייה</th>
                </tr>
            </thead>
        <tbody>
          {imageVisualization.map((imageVisualization,i) => {
            return (
              <tr key={imageVisualization._id}>
              <th scope="row">{i+1}</th>
              <td>{imageVisualization._id}</td>
              <td>{imageVisualization.sender}</td>
              <td>{imageVisualization.student[0].student_id}</td>
              <td> 
                <Popup trigger={<img src={imageVisualization.imagePath} style={{width:'100%',maxWidth:'100px'}}></img>} 
                  modal
                  nested
                  >
                {close => (
                  <div className="modals" style={{maxWidth:'450px'}}>
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                      <div className="content">
                      <img id="capture" src={imageVisualization.imagePath} style={{width:'100%',maxWidth:'600px'}}></img>
                      </div>
                      <div className="actions">
                        <button className="btn btn-primary" style={{margin:"10px 15px"}} 
                          onClick={() => {
                            console.log('modal closed ');
                            close();
                              }}
                              >
                            לחזור
                        </button>
                        <button type="submit" className="btn btn-primary" style={{margin:"10px 15px"}} onClick={() => exportImage("#capture", "Visualisation.jpg")}>
                            להוריד את התמונה
                        </button>
                    </div>
                </div>
      )}
      </Popup>
              </td>
              <td> 
                <button type="submit" className="btn btn-primary" style={{margin:"10px 15px"}} onClick={() => deleteImageVisualisation(imageVisualization._id)}>
                    למחוק
                </button>
              </td>
            </tr>
              );
          })}
        </tbody>
        </table>
        </div>
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


export default ViewListVisualisation;