import React, {useState} from "react";
import Teachers from "./pages/Teachers";
import Drawer from './navigation/drawer';
import Courses from './pages/Courses';
import Groups from './pages/Groups';
import Home from './pages/Home'
import {BrowserRouter as Router,  Switch, Route} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container : {
    display : "flex" 
  }
})

function App() {
  const classes = useStyles();
  return(
    <Router>
      <div className = {classes.container}>
        <Drawer />
        <Switch>
          <Route path='/' exact component = {Home}/>
          <Route path='/groupes' exact component = {Groups}/>
          <Route path='/enseignants' exact component = {Teachers}/>
          <Route path='/matieres' exact component = {Courses}/>
        </Switch>
      </div>
    </Router>
  );
}



export default App;