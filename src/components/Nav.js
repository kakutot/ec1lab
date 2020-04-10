import React from 'react';
import {
    BrowserRouter as Router,
    NavLink
  } from "react-router-dom";
import '../index.css';

export default function Nav(props) {
    return <div className = "nav">
         {props.items.map((item, index) => (
            <div>
                <NavLink to={`/cocomo/${item}`} className="navItem"
                 activeClassName="active">{item}</NavLink>
            </div>
        ))}
        </div>
}