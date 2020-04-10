import React from 'react';
import '../index.css';
import {
    useLocation,
    useParams
  } from "react-router-dom";

function Name () {
   const location = useLocation()

   const index = location.pathname.search(/\d/)
   console.log(index)
   let str = "";

   console.log(location.pathname.charAt(index))
   switch(location.pathname.charAt(index)) {
      case "1" : 
         str = "Base COCOMO";
         break;
      case "2" :
        str = "Intermediate COCOMO";
         break;
      case "3" :
         str = "COCOMO 2";
         break;
      default : 
        str = "Base COertretO";
        break;
   }

   return <div className="name">
     {location.pathname === "/" ? "Cocomo base" : str}</div>
}

export default Name