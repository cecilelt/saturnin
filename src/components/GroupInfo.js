import React, { useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

function GroupInfo(props) {
  const classes = useStyles();
  const [newGroupName, setNewGroupName] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  let modifiedGroup;

  const setGroupName = (event) => {
    setNewGroupName(event.target.value);
  };

  const setLevel = (event) => {
    setNewLevel(event.target.value);
  };

  const setDescription = (event) => {
    setNewDescription(event.target.value);
  };

  const openWarning = () => {
    setOpen(true);
  };

  const cancelConfirmation = () => {
    setOpen(false);
  };

  function openEditingForm() {
    setOpenEditForm(true);
    getSpecificGroup(props.groupId);
  }

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  function getSpecificGroup(groupId) {
    axios.get("/groups/" + groupId).then((response) => {
      modifiedGroup = response.data;
      setNewLevel(modifiedGroup.level);
      setNewGroupName(modifiedGroup.groupName);
      setNewDescription(modifiedGroup.description);
    });
  }

  function deleteGroup() {
    setOpen(false);
    axios.delete("/groups/" + props.groupId).then((response) => {
      console.log(response);
      window.location.reload(false);
    });
  }

  function modifyGroup() {
    setOpenEditForm(false);

    const modifiedGroup = {
      groupName: newGroupName,
      level: newLevel,
      description: newDescription,
    };

    axios.patch("/groups/" + props.groupId, modifiedGroup).then((response) => {
      resetTextFields();
      window.location.reload(false);
    });
  }

  function resetTextFields() {
    setNewGroupName("");
    setNewLevel("");
    setNewDescription("");
  }

  return (
    <div>
      <h1>Niveau : {props.groupLevel}</h1>
      <h1>Description : {props.description}</h1>
      <Tooltip title="Modifier">
        <IconButton onClick={() => openEditingForm()} color="primary">
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton
          onClick={openWarning}
          aria-label="delete"
          color="secondary"
          className={classes.margin}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={cancelConfirmation}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Êtes-vous certain de vouloir supprimer ce groupe?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            La suppression de ce groupe sera permanente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelConfirmation} color="primary">
            Annuler
          </Button>
          <Button onClick={deleteGroup} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditForm}
        onClose={handleCloseEditForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Modification d'un groupe
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour modifier un groupe, entrez les informations correspondantes.
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
            onChange={setGroupName}
          />
          <TextField
            variant="outlined"
            select
            label="Niveau"
            margin="dense"
            fullWidth
            onChange={setLevel}
            helperText="Veuillez sélectionner un niveau"
          >
            {props.groupLevels.map((group) => (
              <MenuItem key={Object.keys(group)[0]} value={newLevel}>
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
            value={newDescription}
            onChange={setDescription}
            helperText="Limite de 100 caractères"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm} color="primary">
            Annuler
          </Button>
          <Button onClick={modifyGroup} color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GroupInfo;
