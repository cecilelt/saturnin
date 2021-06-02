import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../../styles/Evaluations.css'

function SemesterSelector(props) {
    const [semestersList, setSemestersNamesList] = useState([]);

    // USE STATE :
    useEffect(() => {
        let mounted = true;
        axios.get("/semesters").then((response) => {
            if(mounted) {
                setSemestersNamesList(response.data);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => mounted = false;
    }, []);

    const setNewName = (event) => {
        props.sendSemesterName(event.target.value)
    };

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
