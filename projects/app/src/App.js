import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home } from './components'

function App() {
  return (
    <BrowserRouter>
    <Switch>
        <Redirect from='/' to='/home' exact></Redirect>
        <Route path='/home' component={Home}></Route>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
