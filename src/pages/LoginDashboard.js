import React , { useState } from "react";
import {makeStyles} from "@material-ui/core/styles";
import Login_background from "../assets/pencils.jpg";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${Login_background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
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
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

async function loginUser(credentials) {
    return fetch('http://localhost:3001/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

function LoginDashboard({ setToken }) {
    const classes = useStyles();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        const credentials = {
            username: username,
            password: password
        }
        e.preventDefault();
        const token = await loginUser(credentials);
        setToken(token);
    }

    return(
      <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                      <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                      CALIMERO
                  </Typography>
                  <form className={classes.form} onSubmit={handleSubmit}>
                      <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="username"
                          label="Identifiant"
                          name="username"
                          autoComplete="username"
                          autoFocus
                          onChange={e => setUserName(e.target.value)}
                      />
                      <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          label="Mot de passe"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          onChange={e => setPassword(e.target.value)}
                      />
                          <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              className={classes.submit}
                              fullWidth
                          >
                              Connexion
                          </Button>


                      <Grid container>
                          <Grid item xs>
                              <Link href="#" >
                                  Mot de passe oublié?
                              </Link>
                          </Grid>
                          <Grid item>
                              <Link href="/inscription">
                                  {"Pas encore de compte? S'inscrire"}
                              </Link>
                          </Grid>
                      </Grid>
                  </form>
              </div>
          </Grid>
      </Grid>
  );
}
LoginDashboard.propTypes = {
    setToken: PropTypes.func.isRequired
}
export default LoginDashboard;