import React, {useEffect, useState} from "react";
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import '../../styles/Evaluations.css'

function GroupSelector(props) {
    const [groupsList, setGroupsList] = useState([]);

    // USE STATE :
    useEffect(() => {
        let mounted = true;
        axios.get("/groups").then((response) => {
            if(mounted)
            {
                setGroupsList(response.data);
            }
        });
        return () => mounted = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setGroup = (event) => {
        console.log("DANS GROUP COLLECTOR" + event.target.value)
        props.sendGroup(event.target.value)
    };

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
                <MenuItem key={groups._id} value={groups._id}>
                    {groups.groupName}
                </MenuItem>
            ))}
        </TextField>
    </div>
  );
}

export default GroupSelector;
