import React from "react";
import Teachers from "./pages/Teachers";
import Drawer from "./navigation/drawer";
import Courses from "./pages/Courses";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
});

function App() {
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.container}>
        <Drawer />
        <Switch>
          <Route key="login" path="/login" exact component={Login} />
          <Route key= "groups" path="/groupes" exact component={Groups} />
          <Route key="teachers" path="/enseignants" exact component={Teachers} />
          <Route key="courses" path="/matieres" exact component={Courses} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
