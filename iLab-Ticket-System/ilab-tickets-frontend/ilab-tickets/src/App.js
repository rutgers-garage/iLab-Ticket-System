import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import './App.css'
import Home from "./components/Home.js"
import Closed from "./components/Closed.js"
import Open from "./components/Open.js"
import Login from "./components/Login.js"
import User from "./components/User.js"

class App extends Component {
  render(){
    return (
        <div className="background">
          <div className="loginButton">
            <a href ="/login"><i class="fas fa-sign-in-alt rise"></i></a>
          </div>
          <BrowserRouter>
                <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/open">{!User.isLoggedIn() ? <Redirect to="/login" /> : <Open/>}</Route>
                  <Route exact path="/closed">{!User.isLoggedIn() ? <Redirect to="/login" /> : <Closed/>}</Route>
                  <Route exact path="/login" component={Login}/>
                  <Route component={Error} />
                </Switch>
          </BrowserRouter>
        </div>
    );
  }
}

export default App;
