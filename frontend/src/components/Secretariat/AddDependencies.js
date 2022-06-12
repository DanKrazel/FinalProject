import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Select from 'react-select';
import { Link, useParams, useNavigate  } from 'react-router-dom'
import DependenciesDataService from "../../services/dependenciesService"
import UserDataService from "../../services/userService";
import CourseDetailsDataService from "../../services/courseDetailsService"
import StudentDataService from "../../services/studentService";

import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';


const AddDependencies = () => {
    const initialStudentState = {
        student_id: null,
        name: "",
        average: "",
        valideunits: "",
        totalunits: "",
        semester: "",
        years: "",
        courses: []
    };
    const [dependencies, setDependencies] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [coursesDetails, setCoursesDetails] = useState([])
    const [semesters, setSemesters] = useState([])
    const [years, setYears] = useState([])
    const [refreshKey, setRefreshKey] = useState(0);
    const [content, setContent] = useState("");

    const [student, setStudent] = useState(initialStudentState);

    console.log(selectedOption);
    console.log(selectedOption2);

    const params = useParams();
    let navigate = useNavigate()

    const styles = StyleSheet.create({
        parent: {
        width: 300,
        height: 500,
        backgroundColor: 'red',
        margin: 50,
    },
    button: {
        flexDirection: 'row',
        height: 500,
        backgroundColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        elevation: 50,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})


  

    useEffect(() => {
        retrieveCoursesDetails();
        retrieveContent();

    //console.log(handlePDfCourse())
    }, [refreshKey]);

  /// f
    function uniqBy(a, key) {
        var seen = {};
        return a.filter(function (item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    }


    
    const retrieveCoursesDetails = () => {
        CourseDetailsDataService.getAll()
            .then(response => {
               // getStudent(params.id);
                console.log("responseDetails", response.data.coursesDetails)
                setCoursesDetails(response.data.coursesDetails)
                setSemesters(uniqBy(response.data.coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
                setYears(uniqBy(response.data.coursesDetails.map(function (a) { return a.yearOfLearning; }), JSON.stringify))
                console.log("semesters response", uniqBy(response.data.coursesDetails.map(function (a) { return a.semesterOfLearning; }), JSON.stringify))
            })
            .catch(e => {
                console.log(e);
            });
    };
    const retrieveContent = () => {
        UserDataService.getSecretariatBoard()
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

    function PreorderDepedency(arrayCourses) {
        const options = []
        for (var i = 0; i < arrayCourses.length; i++) {
            var dict = { value: null, label: arrayCourses[i] }
            options.push(dict);
    }
        return options
}

    function orderDepedency(options, selectedOption, selectedOption2) {
        var Temp_selectedOption = selectedOption;
        var Temp_selectedOption2 = selectedOption2
        console.log(1);
        console.log("orderDepedency");
        console.log(Temp_selectedOption);
        console.log(Temp_selectedOption2);
        console.log("option-", options);
        for (var i = 0; i < options.length; i++) {
            if (options[i].label == Temp_selectedOption.label) {
                console.log(1);
                //console.log(options[i].value);
                options[i].value = Temp_selectedOption2.label;
                console.log(1);
                console.log(options[i]);

            }
            else if (options[i].label == Temp_selectedOption2.label) {
                console.log(1);
                options[i].value = Temp_selectedOption.label;
                console.log(1);
                console.log(options[i]);
            }



        }
        console.log(options);
        return options
    }
    const createPost = (selectedOption, selectedOption2) => {
        const options = PreorderDepedency(coursesDetails);
        console.log("createPost - Post");
        console.log(options);
        orderDepedency(options, selectedOption, selectedOption2);
    }


    var count =0;
    const handleSendDependency = (setSelectedOption, setSelectedOption2) => {
        if(setSelectedOption && setSelectedOption2){
            console.log("label1",setSelectedOption['label']);
            console.log("label2",setSelectedOption2['label']);
            console.log("testdependecy")
            var dataDependecy = {
                StartCoursesname: setSelectedOption['label'],
                EndCoursesname: setSelectedOption2['label'],
            }
            console.log(dataDependecy);
            //getRequestSent(dataRequest)
            DependenciesDataService.postDependency(dataDependecy)
                .then(response => {
                    console.log(response.data)
                    setRefreshKey(oldKey => oldKey + 1)
                    alert('טעון')
            
            })
            .catch(error => {
                console.log(error)
            });
        }
        else{
            alert("You have to choose two dependencies !")
        }
    }
    function getCol(matrix, col) {
        var column = [];
        for (var i = 0; i < matrix.length; i++) {
            column.push(matrix[i][col]);
        }
        return column; // return column data..
    }
    
    return (
    <div>
        {!content ? (
        <><div className="App">

            <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={PreorderDepedency(getCol(coursesDetails,'courseName'))} />
            <Select
                defaultValue={selectedOption2}
                onChange={setSelectedOption2}
                        options={PreorderDepedency(getCol(coursesDetails, 'courseName'))} />

        </div><div>
               
                <div className="row">
                            <button type="button" class="btn btn-primary  btn-lg btn-block" onClick={() => handleSendDependency(selectedOption, selectedOption2)}>  לעלות תלויות </button>
                    <button onClick={() => navigate(-1)} class="btn btn-primary btn-lg btn-block">
                       לחזור לדף הקודם
                    </button>     
                </div>

            </div></>

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

export default AddDependencies;

