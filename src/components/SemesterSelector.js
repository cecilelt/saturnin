import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../styles/Evaluations.css'

function SemesterSelector(props) {
    const [semestersList, setSemestersNamesList] = useState([]);
    const [newSemesterName, setNewSemesterName] = useState(0);

    // USE STATE :
    useEffect(() => {
        getAllSemesterNames();
    }, []);

    const setNewName = (event) => {
        setNewSemesterName(event.target.value);
        console.log("DANS SEMESTER COLLECTOR" + event.target.value)
        props.sendSemesterName(event.target.value)
    };

    function getAllSemesterNames() {
        axios.get("/semesters").then((response) => {
            setSemestersNamesList(response.data);
        });
    }

  return (
    <div class="semester-container">
        <TextField
            defaultValue = ""
            variant="outlined"
            select
            label="Semestre"
            margin="dense"
            onChange={setNewName}
            helperText="Veuillez sélectionner un semestre"
        >
            {semestersList.map((semester) => (
                <MenuItem key={semester.name} value={semester._id}>
                    {semester.name}
                </MenuItem>
            ))}
        </TextField>
    </div>
  );
}

export default SemesterSelector;
