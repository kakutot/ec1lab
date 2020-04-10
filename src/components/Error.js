import React, {Component} from 'react';

const Error = (props) => {
    return (
        <div className="error">
            <h2 className="message">Error occured</h2>
            <h6>{props.error.toString()}</h6>
            <code>{props.error.stack || props.error.stacktrace || "Undefined stacktrace"}</code>
        </div>
    )
}

export default Error;