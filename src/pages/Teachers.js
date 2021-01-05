import React, {useState, useEffect} from "react";
import axios from 'axios';
import '../App.css'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '100%',
  },
});

const columns = [
    { id: 'firstName', label: 'Prénom', minWidth: 75 },
    { id: 'lastName', label: 'Nom de famille', minWidth: 100 },
    { id: 'workPhoneNumber', label: 'Bureau', minWidth: 100 },
    { id: 'homePhoneNumber', label: 'Maison', minWidth: 100 },
    { id: 'cellphoneNumber', label: 'Cellulaire', minWidth: 100 },
    { id: 'email', label: 'Courriel', minWidth: 100 },
];
function Teachers(props) {
    const classes = useStyles();
    const [teachersList, setTeachersList] = useState([{}]);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newWorkPhoneNumber, setNewWorkPhoneNumber] = useState("");
    const [newHomePhoneNumber, setNewHomePhoneNumber] = useState("");
    const [newCellphoneNumber, setNewCellphoneNumber] = useState("");
    const [newEmail, setNewEmail] = useState("");    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    let currentTeacher = 0;

    useEffect(() => {
        getAllTeachers();
    })
    
    const setFirstName = (event) => {
        setNewFirstName(event.target.value) 
    };

    const setLastName = (event) => {
        setNewLastName(event.target.value) 
    };

    const setWorkPhoneNumber = (event) => {
        setNewWorkPhoneNumber(event.target.value) 
    };

    const setHomePhoneNumber = (event) => {
        setNewHomePhoneNumber(event.target.value) 
    };

    const setCellphoneNumber = (event) => {
        setNewCellphoneNumber(event.target.value) 
    };

    const setEmail = (event) => {
        setNewEmail(event.target.value) 
    };

    function getAllTeachers() {
        axios.get("/teachers").then(response => {
            setTeachersList(response.data);
        });
    }
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    function deleteItem(i) {
      teachersList.splice(i, 1);
    }

    const openWarning = () => {
        setOpenConfirmation(true);
    };

    const cancelConfirmation = () => {
        setOpenConfirmation(false);
    };
    
    function deleteItem (i) {
      const teacherId = teachersList[i]._id;
      console.log(teacherId);
      teachersList.splice(i, 1);
      axios.delete("/teachers/" + teacherId).then(response => {
          console.log(response);
          window.location.reload(false);
      });

    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    function submitTeacher() {
        setOpen(false);
        const savedTeacher = {
            firstName: newFirstName,
            lastName: newLastName,
            workPhoneNumber : newWorkPhoneNumber,
            homePhoneNumber: newHomePhoneNumber,
            cellphoneNumber : newCellphoneNumber,
            email: newEmail
        };
        console.log(savedTeacher);

        axios.post("/teachers", savedTeacher).then(response => {
            savedTeacher.firstName = "";
            savedTeacher.lastName = "";
            savedTeacher.workPhoneNumber = "";
            savedTeacher.homePhoneNumber = "";
            savedTeacher.cellphoneNumber = "";
            savedTeacher.email = "";

            setNewFirstName("");
            setNewLastName("");
            setNewWorkPhoneNumber("");
            setNewHomePhoneNumber("");
            setNewCellphoneNumber("");
            setNewEmail("");
        });
    };

  return (
    <Paper className={classes.root}>
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
               <TableCell
                  key="actions"
                  style={{ minWidth: 100 }}
                >
                  Actions
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    currentTeacher = i;
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <IconButton
                      onClick={openWarning} 
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>

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
        count={teachersList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Ajouter un enseignant
    </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Nouvel enseignant</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pour ajouter un nouvel enseignant, entrez ses informations correspondantes.
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
          id="workPhoneNumber"
          label="Téléphone du bureau"
          type="email"
          fullWidth
          value={newWorkPhoneNumber}
          onChange={setWorkPhoneNumber}
      />
      <TextField
          variant="outlined"
          margin="dense"
          id="homePhoneNumber"
          label="Téléphone de la maison"
          type="email"
          fullWidth
          value={newHomePhoneNumber}
          onChange={setHomePhoneNumber}
      />
      <TextField
          variant="outlined"
          margin="dense"
          id="cellphoneNumber"
          label="Téléphone cellulaire"
          type="email"
          fullWidth
          value={newCellphoneNumber}
          onChange={setCellphoneNumber}
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
        <Button onClick={handleClose} color="primary">
          Annuler
        </Button>
        <Button onClick={submitTeacher} color="primary">
          Soumettre
        </Button>
      </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmation}
        TransitionComponent={Transition}
        keepMounted
        onClose={cancelConfirmation}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        >
      <DialogTitle id="alert-dialog-slide-title">{"Êtes-vous certain de vouloir supprimer cet enseignant?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        La suppression de cet enseignant sera permanente.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={cancelConfirmation} color="primary">
      Annuler
      </Button>
      <Button  onClick={deleteItem.bind(this, currentTeacher)} color="primary">
      Confirmer
      </Button>
      </DialogActions>
      </Dialog>
    </Paper>

  );
}

export default Teachers;