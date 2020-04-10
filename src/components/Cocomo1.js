import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import '../index.css'

export class ProjVals {
    constructor(a, b ,c ,d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
}

export class Cocomo1 extends React.Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            "size" : 0,
            projectType : null,
            result : null,
            submitted : false,
            valid : false,
            errors : {
                "size" : {
                        msg : "Size is non negative",
                        updated : false,
                        shown : true
                }
            }
        };
        this.projectTypes = new Map([
            ["Org",  new ProjVals(2.4, 1.05, 2.5, 0.38)],
            ["Emb", new ProjVals(3.0, 1.12, 2.5, 0.35)],
            ["Sem", new ProjVals(3.6, 1.2, 2.5, 0.32)]])
        this.inputFieldsNames = ["size"]    
        this.handleInputUpdate = this.handleInputUpdate.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.preflightClear = this.preflightClear.bind(this)
        this.handleProjTypeSel = this.handleProjTypeSel.bind(this)
    }

    handleProjTypeSel(event) {
        const name = event.target.getAttribute('name')
        this.setState({projectType : name})
        this.checkErrors(this.state)
    }

    calcRes() {
        let project = this.projectTypes.get(
            this.state.projectType); 

        let PM = project.a * ((this.state.size) ^ project.b)
        let TM = project.c * ((PM) ^ project.d)
        let SS = PM/TM
        let P = this.state.size/PM
        
        let toFix2 = (val) => parseFloat(val).toFixed(2);

        return `PM = ${toFix2(PM)} \nTM = ${toFix2(TM)} \nSS = ${toFix2(SS)} \nP = ${toFix2(P)}`
    }   

    handleClear() {
        this.setState({
           "size" : 0,
           result : "",
           submitted : false,
        })
    }

    preflightClear(event) {
        let validated = event.target.value.trim()
                                               
        const regex = /^[0-9]{0,5}$/g;
        const regexed = regex.test(validated)
        if (regexed) {
           return validated 
        } 
        
        return null  
   }

    handleInputUpdate(event) {
        const cleared = this.preflightClear(event)
        event.persist()
        if (cleared !== null)
        {
            const name = event.target.getAttribute('name')
            const prevErrors = {...this.state.errors}
            if (prevErrors[name]) {
                prevErrors[name].updated = true 
            } 
            this.setState({ [name] : cleared}, () => { 
                this.checkErrors(this.state)
            });
        } 
    }

    checkErrors(state) {
        const updateErrorState = (val, show) => {
            if (this.inputFieldsNames.includes(val)) {
                const errors = {...state}.errors
                errors[val].shown = show
                this.setState({ errors}, () => {
                    const valid = Object.keys(this.state.errors).every(val => {
                        return this.state.errors[val].shown === false
                    }) && this.state.projectType
                    this.setState({valid}, () =>{})
                })
            }
        }

        Object.keys(state).forEach((val) => {
            if(!this.checkEqualOrBiggerThanZeroValidity(state[val])) {
                updateErrorState(val, true)
            } else {
                updateErrorState(val, false)
            }        
        })
    }

    checkNotNegativeValidity(value) {
        return new String(value).valueOf() > 0
    }

    checkEqualOrBiggerThanZeroValidity(value) {
        return new String(value).valueOf() >= 0
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState(() => ({
            result : this.calcRes(),
            submitted : true
        }))
    }

    render() {
        return (
            <Fragment>
                <form onSubmit={this.handleSubmit} className="inputForm">
                <div>
                        {this.inputFieldsNames.map((val, index, arr) => 
                                <div className="outerDiv">
                                    <label htmlFor={val}>{val.charAt(0).toUpperCase() + val.slice(1)}</label>
                                        <input
                                        key={val}
                                        id={val}
                                        name={val}
                                        placeholder={0}
                                        type="text"
                                        onChange={this.handleInputUpdate}
                                        value={this.state[val]}
                                        />
                                        
                                        {this.state.errors[val] && this.state.errors[val].updated && 
                                        <div id={`${val}-error`} className="errorField" hidden={
                                            !this.state.errors[val].shown}>
                                            {this.state.errors[val].msg}
                                        </div>
                                        }
                            </div> 
                        )}
                    </div>
                    <table>
                            <thead>
                                <tr>
                                    <td className = "cTd">Project type</td>
                                    {Object.getOwnPropertyNames(new ProjVals())
                                            .map((value) => 
                                                    <td className = "cTd">{value}</td>
                                                )}
                                                <td>Checked</td>
                                </tr>
                            </thead>
                            <tbody>
                                {[...this.projectTypes.entries()].map((val) => 
                                    <tr>
                                    <td  className = "cTd">{val[0]}</td>
                                        {
                                            Object.values(val[1]).map((value) => <td className = "cTd">{value}</td>)
                                        }
                                        <td><input type="checkbox" name={val[0]} 
                                            checked={this.state.projectType === val[0]}
                                            onChange={this.handleProjTypeSel}></input></td>
                                    </tr>
                                )}
                            </tbody>
                    </table>
                    <div className="buttonsArea">
                        <input type="submit" className="btn submitBtn" value="Submit" 
                        disabled={!this.state.valid ? "disabled" : ""}/>
                        <button className="btn btnClear" onClick={this.handleClear} 
                            disabled={
                                Object.keys(this.state).reduce((isZero, cur) => {
                                    return isZero &= !this.checkNotNegativeValidity(this.state[cur])
                                }, true)}>
                            Clear
                        </button>
                    </div>
                    { this.state.submitted === true && 
                    <div className="resultArea">
                    <textarea value={this.state.result}>  
                    </textarea>
                    </div> }  
                </form>
            </Fragment>
        );
    }
}