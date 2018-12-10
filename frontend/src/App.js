import React, { Component } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import logo from './logo.svg';
import './App.css';
import LandingComponent from "./LandingComponent"
import Auth from "./Auth"
import ChatRouter from "./ChatRouter"

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path = "/" component = {LandingComponent} />
          <Route path = "/chat" component = {ChatRouter} />
        </Switch>

      </BrowserRouter>
    );
  }
}

export default App;
