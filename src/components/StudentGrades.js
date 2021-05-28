import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../styles/Evaluations.css'

function StudentGrades(props) {
    const [studentsList, setStudentsList] = useState([]);
    const [newCourseName, setNewCourseName] = useState(0);

    // USE STATE :
    useEffect(() => {
        getAllStudents();
    }, []);

    const setNewName = (event) => {
        setNewCourseName(event.target.value);
        console.log("DANS SEMESTER COLLECTOR" + event.target.value)
        props.sendCourseName(event.target.value)
    };

    function getAllStudents() {
        axios.get("/students/group" + props.group).then((response) => {
            setStudentsList(response.data);
        });
        console.log("DANS COURSE SELECTOR: " + studentsList)
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

export default StudentGrades;
