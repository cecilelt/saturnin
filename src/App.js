import React from "react";
import Teachers from "./pages/Teachers";
import Drawer from "./navigation/drawer";
import Courses from "./pages/Courses";
import Groups from "./pages/Groups";
import Students from "./pages/Students";
import Preferences from "./pages/Preferences";
import SignUp from "./pages/SignUp";
import Evaluations from "./pages/Evaluations";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import LoginDashboard from "./pages/LoginDashboard";
import useToken from './useToken';

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
});

function App() {
  const classes = useStyles();
  // For the token when logging in
  const { token, setToken } = useToken();
  if(!token) {
    console.log("Token : " + token)
    if(window.location.pathname === "/inscription")
    {
      return <SignUp setToken={setToken} />
    }
    else
    {
      return <LoginDashboard setToken={setToken} />
    }
  }


  return (
    <Router>
      <div className={classes.container}>
        <Drawer />
        <Switch>
          <Route key="inscription" path="/inscription" exact component={SignUp} />
          <Route key="preferences" path="/preferences" exact component={Preferences} />
          <Route key= "groups" path="/groupes" exact component={Groups} />
          <Route key="teachers" path="/enseignants" exact component={Teachers} />
          <Route key="courses" path="/matieres" exact component={Courses} />
          <Route key="students" path="/eleves" exact component={Students} />
          <Route key="evaluations" path="/evaluations" exact component={Evaluations} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
