import React, {useState} from "react";
import Tweet from "./Tweet";
import Nav from './Nav';
import Shop from './Shop';
import About from './About'
import {BrowserRouter as Router,  Switch, Route} from 'react-router-dom';

function App() {
  const counter = 0;
  return(
    <Router>
      <div className='app'>
        <Nav />
        <Switch>
          <Route path='/about' exact component = {About}/>
          <Route path='/shop' exact component = {Shop}/>
        </Switch>
      </div>
    </Router>
  );
}



export default App;