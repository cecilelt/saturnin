import React, {useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

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
    const [open, setOpen] = useState(false);

    const openWarning = () => {
        setOpen(true);
    };

    const cancelConfirmation = () => {
        setOpen(false);
    };

    function deleteGroup () {
        setOpen(false);
        console.log(props.groupId);
        axios.delete("/groups/" + props.groupId).then(response => {
            console.log(response);
            window.location.reload(false);
        });

    }
    return(
        <div >
            <h1>{props.groupLevel}</h1>
            <h1>{props.description}</h1>
            <IconButton onClick={openWarning} aria-label="delete" className={classes.margin}>
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={cancelConfirmation}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Êtes-vous certain de vouloir supprimer ce groupe?"}</DialogTitle>
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
        </div>
    );

}

export default GroupInfo;