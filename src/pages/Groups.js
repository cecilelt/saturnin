import React, {useState, useEffect} from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GroupInfo from '../components/GroupInfo'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function Groups() {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [groupNamesList, setGroupNamesList] = useState([{}]);
    const [groupLevels, setGroupLevels] = useState([]);
    const [groupName, setGroupName] = useState("");

    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupLevel, setNewGroupLevel] = useState(0);
    const [newGroupDescription, setNewGroupDescription] = useState("");

    const setNewName = (event) => {
        setNewGroupName(event.target.value) 
    };
    
    const setNewLevel = (event) => {
        setNewGroupLevel(event.target.value) 
    };

    const setNewDescription = (event) => {
        setNewGroupDescription(event.target.value) 
    };

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleClickOpen = () => {
        setOpen(true);
        getAllLevels();
    };

    const handleClose = () => {
        setOpen(false);
    };

    function submitGroup() {
        setOpen(false);
        const savedGroup = {
            groupName: newGroupName,
            level: newGroupLevel,
            description : newGroupDescription
        };
        console.log(savedGroup);

        axios.post("/groups", savedGroup).then(response => {
            savedGroup.name = "";
            savedGroup.level = 0;
            savedGroup.description = "";
        });
        setNewGroupName("");
        setNewGroupLevel(0);
        setNewGroupDescription("");
        window.location.reload(false);
    };

    // Executed everytime the component is rendered
    useEffect(() => {
        getAllGroups();
    }, []);

    const tabs = groupNamesList.map(tab => {
        return(
             <Tab key= {tab._id} label={tab.groupName}/>
        )
    })

    function getAllGroups() {
        axios.get("/groups").then(response => {
            setGroupNamesList(response.data);
            // console.log(groupNamesList);
        });
    }

    function getAllLevels() {
        axios.get("/groups/levels").then(response => {
            setGroupLevels(response.data);
            console.log(response.data);
        });
    }

    return (
        <Paper className={classes.root}>
        <Tabs
            value={selectedTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            {tabs}
        </Tabs>
            <GroupInfo groupLevel = {groupNamesList[selectedTab].level} description = {groupNamesList[selectedTab].description} />

        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Ajouter un groupe
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Nouveau groupe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour ajouter un nouveau groupe, entrez le nom, le niveau et la description du groupe désiré.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nom du groupe"
            type="email"
            fullWidth
            value={newGroupName}
            onChange={setNewName}
          />
        {/* <TextField
            select
            label="Niveau"
            margin="dense"
            fullWidth
            onChange={handleChange}
            helperText="Veuillez sélectionner un niveau"
        >
            {groupLevels.map((group) => (
            <MenuItem key= {Object.keys(group)[0]} value={savedGroup.level}>
                {group}
            </MenuItem>
            ))}
        </TextField> */}
                  <TextField
            margin="dense"
            id="level"
            label="Nom du groupe"
            type="email"
            fullWidth
            value={newGroupLevel}
            onChange={setNewLevel}
          />
        <TextField
            margin="dense"
            id="description"
            label="Description"
            type="email"
            inputProps={{ maxLength: 100 }}
            fullWidth
            value = {newGroupDescription}
            onChange={setNewDescription}
            helperText="Limite de 100 caractères"

        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={submitGroup} color="primary">
            Soumettre
          </Button>
        </DialogActions>
        </Dialog>
        </Paper>
    );
}

