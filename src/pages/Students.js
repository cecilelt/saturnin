import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import SendIcon from "@material-ui/icons/Send";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "100%",
  },
});

const columns = [
  { id: "firstName", label: "Prénom", minWidth: 75 },
  { id: "lastName", label: "Nom de famille", minWidth: 100 },
  { id: "group", label: "Groupe", minWidth: 100 },
  { id: "email", label: "Courriel", minWidth: 100 },
];

export default function Courses() {
  const classes = useStyles();
  const [studentsList, setStudentsList] = useState([{}]);
  const [page, setPage] = useState(0);
  const [openAddStudentForm, setOpenAddStudentForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentStudent, setCurrentStudent] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    getAllStudents();
  });

  const setFirstName = (event) => {
    setNewFirstName(event.target.value);
  };

  const setLastName = (event) => {
    setNewLastName(event.target.value);
  };

  const setGroup = (event) => {
    setNewGroup(event.target.value);
  };

  const setEmail = (event) => {
    setNewEmail(event.target.value);
  };

  function resetTextFields() {
    setNewFirstName("");
    setNewLastName("");
    setNewGroup("");
    setNewEmail("");
  }

  // HANDLE FUNCTIONS :
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenAddStudentForm = () => {
    setOpenAddStudentForm(true);
  };
  const handleCloseAddStudentForm = () => {
    setOpenAddStudentForm(false);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    resetTextFields();
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function openEditingForm(rowId) {
    getSpecificStudent(rowId);
    setOpenEditForm(true);
    setCurrentStudent(rowId);
    // console.log(currentStudent);
  }

  const cancelConfirmation = () => {
    setOpenConfirmation(false);
    resetTextFields();
  };

  const openWarning = (rowId) => {
    setCurrentStudent(rowId);
    setOpenConfirmation(true);
  };
  const handleCloseSnackbar = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  // HTTPS CALLS :

  function getAllStudents() {
    axios.get("/students").then((response) => {
      setStudentsList(response.data);
    });
  }

  function getSpecificStudent(rowId) {
    axios.get("/students/" + rowId).then((response) => {
      setNewFirstName(response.data.firstName);
      setNewLastName(response.data.lastName);
      setNewGroup(response.data.group);
      setNewEmail(response.data.email);

      setCurrentStudent(response.data._id);
    });
  }
  function deleteStudent() {
    axios.delete("/students/" + currentStudent).then((response) => {
      getAllStudents();
      setOpenConfirmation(false);
      setSnackbarMessage("Étudiant supprimé!");
      setOpenSnackbar(true);
    });
  }
  function modifyStudent() {
    setOpenEditForm(false);

    const modifiedStudent = {
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail,
      group: newGroup,
    };

    axios
      .patch("/students/" + currentStudent, modifiedStudent)
      .then((response) => {
        resetTextFields();
        setOpenSnackbar(true);
        setSnackbarMessage("Étudiant modifié!");
      });
  }

  function generatePDF(rowId) {
    axios.get("/students/" + rowId).then((response) => {

      const savedStudent = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        group: response.data.group,
        email: response.data.email,
      };

      setNewFirstName(response.data.firstName);
      setNewLastName(response.data.lastName);
      setNewGroup(response.data.group);
      setNewEmail(response.data.email);

      setCurrentStudent(response.data._id);

      axios.post("/students/pdf/create-pdf", savedStudent).then(() =>
        axios
          .get("/students/pdf/fetch-pdf", { responseType: "blob" })
          .then((res) => {
            const generatedPDF = new Blob([res.data], {
              type: "application/pdf",
            });
            var fileURL = URL.createObjectURL(generatedPDF);
            window.open(fileURL);
          })
      );
    });
  }

  function submitStudent() {
    setOpenAddStudentForm(false);
    const savedStudent = {
      firstName: newFirstName,
      lastName: newLastName,
      group: newGroup,
      email: newEmail,
    };

    axios.post("/students", savedStudent).then((response) => {
      resetTextFields();
      setOpenSnackbar(true);
      setSnackbarMessage("Étudiant ajouté!");
    });
  }

  return (
    <Paper className={classes.root}>
      <h1>Étudiants</h1>

      {/* TABLE DES ÉTUDIANTS */}

      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key="bilan" style={{ minWidth: 100 }}>
                Bilan
              </TableCell>
              <TableCell key="actions" style={{ minWidth: 100 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}

                    <TableCell>
                      {/* BOUTON - ENVOYER RÉSULTATS PAR COURRIEL */}

                      <Tooltip title="Envoyer les résultats">
                        <IconButton
                          color="primary"
                        >
                          <SendIcon />
                        </IconButton>
                      </Tooltip>

                      {/* BOUTON - TÉLÉCHARGER RÉSULTATS PDF */}

                      <Tooltip title="Télécharger les résultats">
                        <IconButton
                          onClick={() => generatePDF(row._id)}
                          color="primary"
                        >
                          <FindInPageIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    {/* BOUTON - MODIFIER UN ÉTUDIANT */}

                    <TableCell>
                      <Tooltip title="Modifier">
                        <IconButton
                          onClick={() => openEditingForm(row._id)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      {/* BOUTON - SUPPRIMER UN ÉTUDIANT */}

                      <Tooltip title="Supprimer">
                        <IconButton
                          onClick={() => openWarning(row._id)}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={studentsList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {/* BOUTON - AJOUTER UN ÉTUDIANT */}

      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpenAddStudentForm}
      >
        Ajouter un étudiant
      </Button>

      {/* FORMULAIRE POUR L'AJOUT D'UN ÉTUDIANT */}

      <Dialog
        open={openAddStudentForm}
        onClose={handleCloseAddStudentForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Nouvel étudiant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour ajouter un nouvel étudiant, entrez ses informations
            correspondantes.
          </DialogContentText>
          <TextField
            variant="outlined"
            autoFocus
            margin="dense"
            id="firstName"
            label="Prénom"
            type="email"
            fullWidth
            value={newFirstName}
            onChange={setFirstName}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="lastName"
            label="Nom de famille"
            type="email"
            fullWidth
            value={newLastName}
            onChange={setLastName}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="group"
            label="Groupe"
            type="email"
            fullWidth
            value={newGroup}
            onChange={setGroup}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="email"
            label="Courriel"
            type="email"
            fullWidth
            value={newEmail}
            onChange={setEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddStudentForm} color="primary">
            Annuler
          </Button>
          <Button onClick={submitStudent} color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>

      {/* FORMULAIRE POUR MODIFICATION D'UN ÉTUDIANT */}

      <Dialog
        open={openEditForm}
        onClose={handleCloseEditForm}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Modification d'un étudiant
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour modifier un étudiant, entrez ses informations correspondantes.
          </DialogContentText>
          <TextField
            variant="outlined"
            autoFocus
            margin="dense"
            id="firstName"
            label="Prénom"
            type="email"
            fullWidth
            value={newFirstName}
            onChange={setFirstName}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="lastName"
            label="Nom de famille"
            type="email"
            fullWidth
            value={newLastName}
            onChange={setLastName}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="group"
            label="Groupe"
            type="email"
            fullWidth
            value={newGroup}
            onChange={setGroup}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="email"
            label="Courriel"
            type="email"
            fullWidth
            value={newEmail}
            onChange={setEmail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditForm} color="primary">
            Annuler
          </Button>
          <Button onClick={modifyStudent} color="primary">
            Soumettre
          </Button>
        </DialogActions>
      </Dialog>

      {/* AVERTISSEMENT DE SUPPRESSION D'UN ÉTUDIANT */}

      <Dialog
        open={openConfirmation}
        TransitionComponent={Transition}
        keepMounted
        onClose={cancelConfirmation}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Êtes-vous certain de vouloir supprimer cet étudiant?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            La suppression de cet étudiant sera permanente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelConfirmation} color="primary">
            Annuler
          </Button>
          <Button onClick={deleteStudent.bind(this)} color="primary">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      {/* SNACKBARS */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
