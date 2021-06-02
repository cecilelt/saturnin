import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import '../styles/DataTables.css'
import SemesterSelector from "../components/evaluations/SemesterSelector";

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
    { id: "courseName", label: "Nom du cours", minWidth: 75 },
    { id: "level", label: "Niveau", minWidth: 100 },
    { id: "numStudents", label: "Nombre d'élèves", minWidth: 100 },
    { id: "teacher", label: "Enseignant", minWidth: 100 },
    { id: "semester", label: "Semestre", minWidth: 100 },
];

function Courses(props) {
    const classes = useStyles();
    const [coursesList, setCoursesList] = useState([{}]);
    const [newCourseName, setNewCourseName] = useState("");
    const [newLevel, setNewLevel] = useState("");
    const [newNumStudent, setNewNumStudents] = useState("");
    const [newTeacher, setNewTeacher] = useState("");
    const [newSemesterName, setNewSemesterName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [currentCourse, setCurrentCourse] = useState("");

    let modifiedCourse;

    useEffect(() => {
        getAllCourses();
    });

    // USE STATE :
    const setCourseName = (event) => {
        setNewCourseName(event.target.value);
    };

    const setLevel = (event) => {
        setNewLevel(event.target.value);
    };

    const setNumStudent = (event) => {
        setNewNumStudents(event.target.value);
    };

    const setTeacher = (event) => {
        setNewTeacher(event.target.value);
    };

    // HANDLE FUNCTIONS :
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
        resetTextFields();
    };

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const cancelConfirmation = () => {
        setOpenConfirmation(false);
        resetTextFields();
    };

    const openWarning = (rowId) => {
        setCurrentCourse(rowId);
        setOpenConfirmation(true);
    };

    function openEditingForm(rowId) {
        getSpecificCourse(rowId);
        setOpenEditForm(true);
        setCurrentCourse(rowId);
    }

    // HTTP CALLS :
    function getAllCourses() {
        axios.get("/courses").then((response) => {
            setCoursesList(response.data);
        });
    }

    function getSpecificCourse(rowId) {
        axios.get("/courses/" + rowId).then((response) => {
            modifiedCourse = response.data;
            setNewCourseName(modifiedCourse.courseName);
            setNewLevel(modifiedCourse.level);
            setNewNumStudents(modifiedCourse.numStudents);
            setNewTeacher(modifiedCourse.teacher);
            setNewSemesterName(modifiedCourse.semester);
        });
    }

    function deleteItem(i) {
        axios.delete("/courses/" +  currentCourse).then((response) => {
            getAllCourses();
            setOpenConfirmation(false);
            setSnackbarMessage("Cours supprimé!");
            setOpenSnackbar(true);
        });
    }

    function submitCourse() {
        setOpen(false);
        const savedCourse = {
            courseName: newCourseName,
            level: newLevel,
            numStudents: newNumStudent,
            teacher: newTeacher,
            semester: newSemesterName
        };

        console.log(savedCourse)
        axios.post("/courses", savedCourse).then((response) => {
            resetTextFields();
            setOpenSnackbar(true);
            setSnackbarMessage("Cours ajouté!");
        });
    }

    function modifyCourse() {
        setOpenEditForm(false);

        const modifiedCourse = {
            courseName: newCourseName,
            level: newLevel,
            numStudents: newNumStudent,
            teacher: newTeacher,
            semester: newSemesterName
        };

        axios
            .patch("/courses/" + currentCourse, modifiedCourse)
            .then((response) => {
                resetTextFields();
                setOpenSnackbar(true);
                setSnackbarMessage("Cours modifié!");
            });
    }

    function resetTextFields() {
        setNewCourseName("");
        setNewLevel("");
        setNewNumStudents("");
        setNewTeacher("");
    }

    function getSemesterName(semesterName) {
        setNewSemesterName(semesterName)
        console.log("DANS COURSE " + semesterName)
    }

    return (
        <div className={classes.root}>
            <h1 class="pageHeader">Matières</h1>

            {/* TABLE DES MATIÈRES */}

            <TableContainer class="dataTable" className={classes.container}>
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
                            <TableCell key="actions" style={{ minWidth: 100 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coursesList
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

                                        {/* BOUTON - MODIFIER UN ENSEIGNANT */}

                                        <TableCell>
                                            <Tooltip title="Modifier">
                                                <IconButton
                                                    onClick={() => openEditingForm(row._id)}
                                                    color="primary"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            {/* BOUTON - SUPPRIMER UN ENSEIGNANT */}

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
                count={coursesList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

            {/* BOUTON - AJOUTER UN COURS */}
            <div class="addElement">
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Ajouter un cours
                </Button>
            </div>

            {/* FORMULAIRE POUR L'AJOUT D'UN COURS */}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Nouveau cours</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pour ajouter un nouvau cours, entrez ses informations
                        correspondantes.
                    </DialogContentText>
                    <TextField
                        variant="outlined"
                        autoFocus
                        margin="dense"
                        id="courseName"
                        label="Nom du cours"
                        type="email"
                        fullWidth
                        value={newCourseName}
                        onChange={setCourseName}
                    />
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="level"
                        label="Niveau"
                        type="email"
                        fullWidth
                        value={newLevel}
                        onChange={setLevel}
                    />
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="numStudents"
                        label="Nombre d'élèves"
                        type="email"
                        fullWidth
                        value={newNumStudent}
                        onChange={setNumStudent}
                    />
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="teacher"
                        label="Enseignant"
                        type="email"
                        fullWidth
                        value={newTeacher}
                        onChange={setTeacher}
                    />
                    <SemesterSelector sendSemesterName={getSemesterName}/>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={submitCourse} color="primary">
                        Soumettre
                    </Button>
                </DialogActions>
            </Dialog>

            {/* FORMULAIRE POUR MODIFICATION D'UN ENSEIGNANT */}

            <Dialog
                open={openEditForm}
                onClose={handleCloseEditForm}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Modification d'un cours
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pour modifier un cours, entrez ses informations
                        correspondantes.
                    </DialogContentText>
                    <TextField
                        variant="outlined"
                        autoFocus
                        margin="dense"
                        id="courseName"
                        label="Nom du cours"
                        type="email"
                        fullWidth
                        value={newCourseName}
                        onChange={setCourseName}
                    />
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="level"
                        label="Niveau"
                        type="email"
                        fullWidth
                        value={newLevel}
                        onChange={setLevel}
                    />
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="numStudent"
                        label="Nombre d'élèves"
                        type="email"
                        fullWidth
                        value={newNumStudent}
                        onChange={setNumStudent}
                    />
                    <TextField
                        variant="outlined"
                        margin="dense"
                        id="teacher"
                        label="Enseignant"
                        type="email"
                        fullWidth
                        value={newTeacher}
                        onChange={setTeacher}
                    />
                    <SemesterSelector sendSemesterName={getSemesterName}/>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditForm} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={modifyCourse} color="primary">
                        Soumettre
                    </Button>
                </DialogActions>
            </Dialog>

            {/* AVERTISSEMENT DE SUPPRESSION D'UN ENSEIGNANT */}

            <Dialog
                open={openConfirmation}
                TransitionComponent={Transition}
                keepMounted
                onClose={cancelConfirmation}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"Êtes-vous certain de vouloir supprimer ce cours?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        La suppression de ce cours sera permanente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelConfirmation} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={deleteItem.bind(this)} color="primary">
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
        </div>
    );
}

export default Courses;
