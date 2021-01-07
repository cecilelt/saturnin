import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import GroupInfo from "../components/GroupInfo";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupLevel, setNewGroupLevel] = useState(0);
  const [newGroupDescription, setNewGroupDescription] = useState("");

  // USE STATE :
  useEffect(() => {
    getAllLevels();
    getAllGroups();
  }, []);

  const setNewName = (event) => {
    setNewGroupName(event.target.value);
  };

  const setNewLevel = (event) => {
    setNewGroupLevel(event.target.value);
  };

  const setNewDescription = (event) => {
    setNewGroupDescription(event.target.value);
  };

  const changeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabs = groupNamesList.map((tab) => {
    return <Tab key={tab._id} label={tab.groupName} />;
  });

  // HANDLE FUNCTIONS:
  const handleClickOpen = () => {
    setOpen(true);
    getAllLevels();
  };

  const handleClose = () => {
    setOpen(false);
  };

  // HTTP CALLS:
  function submitGroup() {
    setOpen(false);
    const savedGroup = {
      groupName: newGroupName,
      level: newGroupLevel,
      description: newGroupDescription,
    };

    axios.post("/groups", savedGroup).then((response) => {
      savedGroup.name = "";
      savedGroup.level = 0;
      savedGroup.description = "";
      setNewGroupName("");
      setNewGroupLevel(0);
      setNewGroupDescription("");
      window.location.reload(false);
    });
  }

  function getAllGroups() {
    axios.get("/groups").then((response) => {
      setGroupNamesList(response.data);
    });
  }

  function getAllLevels() {
    axios.get("/groups/levels").then((response) => {
      setGroupLevels(response.data);
    });
  }

  return (
    <Paper className={classes.root}>
      {/* TITRE DES ONGLETS */}

      <Tabs
        value={selectedTab}
        onChange={changeTab}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {tabs}
      </Tabs>

      {/* INFORMATIONS DES GROUPES */}

      <GroupInfo
        groupLevels={groupLevels}
        groupId={groupNamesList[selectedTab]._id}
        groupLevel={groupNamesList[selectedTab].level}
        description={groupNamesList[selectedTab].description}
      />

      {/* BOUTON - AJOUTER UN GROUPE */}

      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Ajouter un groupe
      </Button>

      {/* FORMULAIRE D'AJOUT D'UN GROUPE */}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Nouveau groupe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour ajouter un nouveau groupe, entrez le nom, le niveau et la
            description du groupe désiré.
          </DialogContentText>
          <TextField
            variant="outlined"
            autoFocus
            margin="dense"
            id="name"
            label="Nom du groupe"
            type="email"
            fullWidth
            value={newGroupName}
            onChange={setNewName}
          />
          <TextField
            variant="outlined"
            select
            label="Niveau"
            margin="dense"
            fullWidth
            onChange={setNewLevel}
            helperText="Veuillez sélectionner un niveau"
          >
            {groupLevels.map((group) => (
              <MenuItem key={Object.keys(group)[0]} value={newGroupLevel}>
                {group}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="dense"
            id="description"
            label="Description"
            type="email"
            inputProps={{ maxLength: 100 }}
            fullWidth
            value={newGroupDescription}
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
