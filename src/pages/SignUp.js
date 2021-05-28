import React , { useState } from "react";
import {makeStyles} from "@material-ui/core/styles";
import SignUp_background from "../assets/books.jpg";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MaskedInput from 'react-text-mask';
import axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import "../styles/Login.css"
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${SignUp_background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const roles = [
    {
        value: 'admin',
        label: 'Administrateur',
    },
    {
        value: 'teacher',
        label: 'Enseignant',
    },
];

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

TextMaskCustom.propTypes = {
    inputRef: PropTypes.func.isRequired,
};

function SignUp({ setToken }) {
    const classes = useStyles();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState();
    const [role, setRole] = useState();
    const [openAccountConfirmation, setOpenAccountConfirmation] = useState(false);
    const [phoneNumberValues, setPhoneNumberValues] = useState({
        phoneNumber: '(   )   -    ',
        numberformat: '1320',
    });

    const handlePhoneNumberChange = (event) => {
        setPhoneNumberValues({
            ...phoneNumberValues,
            [event.target.name]: event.target.value,
        });
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleOpenAccountCreation = () => {
        setOpenAccountConfirmation(true);
    };
    const handleCloseAccountCreation = () => {
        setOpenAccountConfirmation(false);
    };

    function submitNewUser() {
        setOpenAccountConfirmation(true);
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumberValues.phoneNumber,
            email: email,
            role: role,
            username: username,
            password: password,
            passwordConfirmation: passwordConfirmation,
        };

        axios.post("/users", newUser).then((response) => {
            newUser.firstName = "";
            newUser.lastName = "";
            newUser.phoneNumber = "";
            newUser.email = "";
            newUser.role = "";
            newUser.username = "";
            newUser.password = "";
            newUser.passwordConfirmation = "";
        });
    }

    function resetTextFields() {
        setFirstName("");

    }
    return(
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <AccountCircleIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        S'inscrire
                    </Typography>
                    <form className={classes.form} onSubmit="return false">
                        <div class="fieldsContainer">
                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="Prénom"
                                name="firstName"
                                autoFocus
                                onChange={e => setFirstName(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="Nom de famille"
                                name="lastName"
                                autoComplete="lastName"
                                onChange={e => setLastName(e.target.value)}
                            />
                            <div class="maskInput">
                                <InputLabel required htmlFor="phoneNumber">Numéro de téléphone</InputLabel>
                                <Input
                                    variant="standard"
                                    margin="normal"
                                    required
                                    fullWidth
                                    onChange={handlePhoneNumberChange}
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    label="Numéro de téléphone"
                                    inputComponent={TextMaskCustom}
                                />
                            </div>

                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresse courriel"
                                name="email"
                                autoComplete="email"
                                onChange={e => setEmail(e.target.value)}
                            />
                            <div class="roleInput">
                                <TextField
                                    id="standard-select-currency"
                                    select
                                    required
                                    fullWidth
                                    label="Rôle"
                                    value={role}
                                    onChange={handleRoleChange}
                                    helperText="Sélectionner le rôle approprié"
                                >
                                    {roles.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>

                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Identifiant"
                                name="username"
                                onChange={e => setUserName(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                onChange={e => setPassword(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                name="passwordConfirmation"
                                label="Confirmation du mot de passe"
                                type="password"
                                id="passwordConfirmation"
                                onChange={e => setPasswordConfirmation(e.target.value)}
                            />
                        </div>

                        <div className="submitDiv">
                            <Button
                                type="button"
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={submitNewUser}
                            >
                                Créer un compte
                            </Button>
                        </div>
                    </form>
                </div>
            </Grid>
            <Grid item xs={false} sm={4} md={7} className={classes.image} />

            {/* FORMULAIRE POUR CONFIRMATION DE L'INSCRIPTION */}

            <Dialog
                open={openAccountConfirmation}
                onClose={handleCloseAccountCreation}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Nouveau compte</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vous êtes maintenant inscrit!
                    </DialogContentText>
                    <Avatar className={classes.avatar}>
                        <CheckCircleIcon />
                    </Avatar>

                </DialogContent>
                <DialogActions>
                    <Link href="/">
                        Revenir à la page d'accueil
                    </Link>
                </DialogActions>
            </Dialog>
        </Grid>


    );
}
SignUp.propTypes = {
    setToken: PropTypes.func.isRequired
}
export default SignUp;
