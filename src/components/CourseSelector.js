import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../styles/Evaluations.css'

function CourseSelector(props) {
    const [coursesList, setCoursesNamesList] = useState([]);
    const [newCourseName, setNewCourseName] = useState(0);

    // USE STATE :
    useEffect(() => {
        getAllCoursesNames();
    }, []);

    const setNewName = (event) => {
        setNewCourseName(event.target.value);
        console.log("DANS SEMESTER COLLECTOR" + event.target.value)
        props.sendCourseName(event.target.value)
    };

    function getAllCoursesNames() {
        axios.get("/courses/" + props.semester).then((response) => {
            setCoursesNamesList(response.data);
        });
        console.log("DANS COURSE SELECTOR: " + coursesList)

    }

  return (
    <div class="semester-container">
        <TextField
            defaultValue = ""
            variant="outlined"
            select
            label="Cours"
            margin="dense"
            onChange={setNewName}
            helperText="Veuillez sélectionner un cours"
        >
            {coursesList.map((courses) => (
                <MenuItem key={courses.courseName} value={courses._id}>
                    {courses.courseName}
                </MenuItem>
            ))}
        </TextField>
    </div>
  );
}

export default CourseSelector;
