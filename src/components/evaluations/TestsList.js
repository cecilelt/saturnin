import React, {useEffect, useState} from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import '../../styles/Evaluations.css'
import {makeStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: "100%",
    },
    tableRow: {
        "&:hover": {
            backgroundColor: '#c3ccd6',
        },
        "&:focus": {
            backgroundColor: "#c3ccd6 !important",
        }
    }
});

const columns = [
    { id: "testName", label: "Nom du test", minWidth: 75 },
    { id: "date", label: "Date", minWidth: 100 },
    { id: "description", label: "Description", minWidth: 100 },
];

function TestsList(props) {
    const classes = useStyles();
    const [testsList, setTestsList] = useState([]);
    const [newTestName, setNewTestName] = useState("");
    const [newDate, setNewDate] = useState(new Date());
    const [newDescription, setNewDescription] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [isRowSelected, setIsRowSelected] = useState(false);

    // USE STATE :
    useEffect(() => {
        let mounted = true;
        axios.get("/tests/" + props.semesterId + "/" + props.courseId + "/" + props.groupId).then((response) => {
            if(mounted)
            {
                setTestsList(response.data);
            }
        });
        return () => mounted = false;
    });

    function getAllTests() {

    }

    const setDescription = (event) => {
        setNewDescription(event.target.value);
    };

    const setTestName = (event) => {
        setNewTestName(event.target.value);
    };

    // HANDLE FUNCTIONS :
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDateChange = (date) => {
        setNewDate(date);
    };

    function selectRow(rowId){
        props.sendTestId(rowId)
    }

    function submitTest() {
        setOpen(false);
        const savedTest = {
            testName: newTestName,
            semesterId: props.semesterId,
            courseId: props.courseId,
            groupsIds: [props.groupId],
            date: newDate,
            description: newDescription,
        };

        console.log(savedTest)

        axios.post("/tests", savedTest).then((response) => {
            resetTextFields();
            // setOpenSnackbar(true);
            // setSnackbarMessage("Enseignant ajouté!");
        });
    }

    function resetTextFields() {
        setNewTestName("");
        setNewDescription("");
        setNewDate("");
    }

    return (
      <div className={classes.root}>
          <h2 class="pageHeader">Sélectionner un test</h2>

          {/* TABLE DES TESTS */}

          <TableContainer class="dataTable" className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow>
                          {columns.map((column) => (
                              <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{minWidth: column.minWidth}}
                              >
                                  {column.label}
                              </TableCell>
                          ))}
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {testsList
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, i) => {
                              return (
                                  <TableRow className={classes.tableRow}
                                            selected={isRowSelected} hover onClick={() => selectRow(row._id) }  role="checkbox" tabIndex={-1} key={row._id}>
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

                                  </TableRow>
                              );
                          })}
                  </TableBody>
              </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={testsList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          {/* BOUTON - AJOUTER UN TEST */}
          <div className="addElement">
              <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                  Ajouter un test
              </Button>
          </div>

          {/* FORMULAIRE POUR L'AJOUT D'UN TEST */}

          <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
          >
              <DialogTitle id="form-dialog-title">Nouveau test</DialogTitle>
              <DialogContent>
                  <DialogContentText>
                      Pour ajouter un nouveau test, entrez ses informations
                      correspondantes.
                  </DialogContentText>
                  <TextField
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      id="testName"
                      label="Nom du test"
                      fullWidth
                      value={newTestName}
                      onChange={setTestName}
                  />

                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                          disableToolbar
                          variant="inline"
                          format="MM/dd/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Date"
                          value={newDate}
                          onChange={handleDateChange}
                          KeyboardButtonProps={{
                              'aria-label': 'change date',
                          }}
                      />
                  </MuiPickersUtilsProvider>

                  <TextField
                      variant="outlined"
                      margin="dense"
                      id="description"
                      label="Description"
                      fullWidth
                      value={newDescription}
                      onChange={setDescription}
                  />
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleClose} color="primary">
                      Annuler
                  </Button>
                  <Button onClick={submitTest} color="primary">
                      Soumettre
                  </Button>
              </DialogActions>
          </Dialog>
      </div>
  );
}

export default TestsList;
