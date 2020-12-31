import React, {useState} from "react";
import Tweet from "./pages/Tweet";
import Drawer from './navigation/drawer';
import Shop from './pages/Shop';
import About from './pages/About'
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
          <Route path='/about' exact component = {About}/>
          <Route path='/shop' exact component = {Shop}/>
        </Switch>
      </div>
    </Router>
  );
}



export default App;