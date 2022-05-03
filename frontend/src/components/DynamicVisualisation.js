import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { Link } from 'react-router-dom'
import DependenciesDataService from "../services/dependencieService"

import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';

const DynamicVisualisation = props => {
    var arrayCourses = ['חדו"א  - 1', 'אלגברה לינארית לתוכנה-ה', 'לוגיקה ונושאים דיסקרטיים I', 'I ארכיטקטורת מחשבים', 'מבוא למדעי המחשב', 'חדוא 2 להנדסת תוכנה',
        'פיסיקה להנדסת תוכנה', 'לוגיקה ונושאים דיסקרטיים II', 'לוגיקה ונושאים דיסקרטיים II', 'תכנות מונחה עצמים', 'מבוא להסתברות וסטטיסטיקה', 'מבוא להסתברות וסטטיסטיקה',
        'יסודות הנדסת תוכנה', 'מבנה נתונים-ה', 'עקרונות שפות תוכנה', 'בדיקות ואיכות בהנדסת תוכנה', 'הנדסת דרישות וניתוח תוכנה', 'אנגלית מדוברת', 'אוטומטים ושפות פורמאליות',
        'אלגורתמים I', 'מבוא לתקשורת מחשבים', 'אנליזה נומרית', 'רשתות תקשורת מחשבים', 'אבטחת נתונים', 'עיבוד תמונה וראייה ממוחשבת', 'בטיחות תוכנה']

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
    


    const initialDependencyState = {
        DepensencieID: "",
        StartCoursesname: "",
        EndCoursesname: "",
    

    };
    const [refreshKey, setRefreshKey] = useState(0);

    const params = useParams();
    const [dependecy, setDependency] = useState(initialDependencyState)
    useEffect(() => {
       // retrieveDependencies();
        //console.log(handlePDfCourse())
    }, [refreshKey]);
    
    var count = 0;
  /*  const retrieveDependencies = () => {
        CourseDataService.find(params.id, "studentID")
            .then(response => {
                console.log(response.data);
                setCourses(response.data.courses);
            })
            .catch(e => {
                console.log(e);
            });
    };
*/
  

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
        const options = PreorderDepedency(arrayCourses);
        console.log("createPost - Post");
        console.log(options);
        orderDepedency(options, selectedOption, selectedOption2);
    }

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    var count =0;
    const handleSendDependency = (setSelectedOption, setSelectedOption2) => {
        console.log(setSelectedOption['label']);
        console.log(setSelectedOption2['label']);
        console.log("testdependecy")
        var dataDependecy = {
            StartCoursesname: setSelectedOption['label'],
            EndCoursesname: setSelectedOption2['label'],
        }
        console.log(dataDependecy);
        //getRequestSent(dataRequest)
        DependenciesDataService.postDependency(dataDependecy)
            .then(response => {
                console.log("postDependecy", response)
                setRefreshKey(oldKey => oldKey + 1)
            })
            .catch(error => {
                console.log(error)
            });
    }
 
    
    return (

        <><div className="App">

            <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={PreorderDepedency(arrayCourses)} />
            <Select
                defaultValue={selectedOption2}
                onChange={setSelectedOption2}
                options={PreorderDepedency(arrayCourses)} />

        </div><div>
               
                
                <button type="button" class="btn btn-primary btn-lg btn-block" onClick={() => createPost(selectedOption, selectedOption2)}>Upload</button>
                <div className="row">
                    <button type="button" class="btn btn-primary btn-lg btn-block" onClick={() => handleSendDependency(selectedOption, selectedOption2)}>Upload</button>
                </div>
                <Link to={"/DynamicVisual/" + params.id} class="btn btn-primary btn-lg btn-block">
                    View student visualisation
                </Link>     

            </div></>
    );



}

export default DynamicVisualisation;

