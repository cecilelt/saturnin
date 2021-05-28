import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../styles/Evaluations.css'

function GroupSelector(props) {
    const [groupsList, setGroupsList] = useState([]);
    const [newGroup, setNewGroup] = useState(0);

    // USE STATE :
    useEffect(() => {
        getAllGroups();
    }, []);

    const setGroup = (event) => {
        setNewGroup(event.target.value);
        console.log("DANS GROUP COLLECTOR" + event.target.value)
        props.sendGroup(event.target.value)
    };

    function getAllGroups() {
        axios.get("/groups").then((response) => {
            setGroupsList(response.data);
        });
        console.log("DANS COURSE SELECTOR: " + groupsList)

    }

  return (
    <div class="semester-container">
        <TextField
            defaultValue = ""
            variant="outlined"
            select
            label="Groupe"
            margin="dense"
            onChange={setGroup}
            helperText="Veuillez sélectionner un groupe"
        >
            {groupsList.map((groups) => (
                <MenuItem key={groups.groupName} value={groups._id}>
                    {groups.groupName}
                </MenuItem>
            ))}
        </TextField>
    </div>
  );
}

export default GroupSelector;
