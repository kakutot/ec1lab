import React from 'react';
import './index.css';
import { App } from './pages/App';
import {render} from "react-dom"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NotFound from "./pages/NotFound"
import { Cocomo1 } from './components/Cocomo1';
import { Cocomo2 } from './components/Cocomo2';
import { Cocomo3 } from './components/Cocomo3';
import Nav from './components/Nav';
import Name from './components/Name';

render(
    <App>
        <Router>
            <Name/>
            <Switch>
                <Route exact path={["/", "/cocomo/1"]} component={Cocomo1}/>
                <Route exact path={["/", "/cocomo/2"]} component={Cocomo2}/>
                <Route exact path={["/", "/cocomo/3"]} component={Cocomo3}/>
                <Route component={NotFound}/>
            </Switch>
            <Nav items={[1,2,3]}/>
        </Router>
    </App>,
    document.getElementById('root')
);
