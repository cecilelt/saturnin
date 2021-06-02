import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../../styles/Evaluations.css'

function SemesterSelector(props) {
    const [semestersList, setSemestersNamesList] = useState([]);

    // USE STATE :
    useEffect(() => {
        getAllSemesterNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setNewName = (event) => {
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
                <MenuItem key={semester._id} value={semester._id}>
                    {semester.name}
                </MenuItem>
            ))}
        </TextField>
    </div>
  );
}

export default SemesterSelector;
