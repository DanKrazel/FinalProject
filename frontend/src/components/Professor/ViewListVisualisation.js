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

      const deleteRequest = (requestID) => {
        console.log("check", requestID)
        RequestDataService.deleteRequest(requestID)
          .then(response => {
            console.log(response.data);
            setRefreshKey(oldKey => oldKey +1)

          })
          .catch(e => {
            console.log(e);
          });
      };

    const sendVisualisation = (id) => {
      navigate(`/Downloadcsv/${id}`)
    }

    const convertBase64toImg = (img) => {

    }

//     const printModal = () => {
//       var modal = document.getElementById('#myModal');

// // Get the image and insert it inside the modal - use its "alt" text as a caption
//       var img = document.getElementById("#image");
//       var modalImg = document.getElementById(imgNum);
//       var captionText = document.getElementById(captionID);
//       img.onclick = function(){
//       modal.style.display = "block";
//       modalImg.src = this.src;
//       captionText.innerHTML = this.alt;
//     } 
// // Get the <span> element that closes the modal
//     var span = document.getElementsByClassName(closeID)[0];
// // When the user clicks on <span> (x), close the modal
//     span.onclick = function() { 
//       modal.style.display = "none";
//     }
//     }

  
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

    return (
    <div>
        {!content ? (
        <div>
        <h1>View visualization from Regina</h1> 
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">visualizationID</th>
                    <th scope="col">Sender</th>
                    <th scope="col">Visualization</th>
                    {/* <th scope="col">StudentID</th>
                    <th scope="col">Student name</th>
                    <th scope="col">Visualisation</th>
                    <th scope="col">Delete</th> */}
                </tr>
            </thead>
        <tbody>
          {imageVisualization.map((imageVisualization,i) => {
            return (
              <tr key={imageVisualization._id}>
              <th scope="row">{i+1}</th>
              <td>{imageVisualization._id}</td>
              <td>{imageVisualization.sender}</td>
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
                            Return
                        </button>
                        <button type="submit" className="btn btn-primary" style={{margin:"10px 15px"}} onClick={() => exportImage("#capture", "Visualisation.jpg")}>
                            Export visualisation
                        </button>
                    </div>
                </div>
      )}
      </Popup>
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