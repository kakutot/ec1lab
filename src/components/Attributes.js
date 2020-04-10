import React, {useEffect, useState} from 'react';
import '../index.css'

function Attributes(props) {
    console.log(props)
    return (
        <div>
            <div className="header">{props.h}</div>
                    <div className ="attributes">
                        {props.children}
                    </div>
        </div>
        )
}

export default Attributes;