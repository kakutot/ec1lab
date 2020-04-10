import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import '../index.css'
import {ProjVals} from './Cocomo1'
import CocomoAttr from './CocomoAttr'
import Attributes from './Attributes'

class AttrVals {
    constructor(hlow,
         low, med, high, vhigh, crit) {
             this.hlow = hlow;
             this.low = low;
             this.med = med;
             this.high = high;
             this.vhigh = vhigh;
             this.crit = crit;
         }
}

export class Cocomo2 extends React.Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.ratings = [
            {value : "hlow",  label : "Very low"},
            {value : "low" ,  label : "Low",},
            {value :"med", label : "Medium"},
            {value : "high", label : "High"},
            {value : "vhigh", label : "Very high"},
            {value : "crit", label : "Critical"}]
        this.state = {
            "size" : 0,
            attrs : {
                "RSR" : this.ratings[0].value,
                "SAD" : this.ratings[0].value,
                "CP"  : this.ratings[0].value,
                "RTPC" :this.ratings[0].value,
                "MC" : this.ratings[0].value,
                "VVME" : this.ratings[0].value,
                "RTT" : this.ratings[0].value,
                "AC" : this.ratings[0].value,
                "SEC" : this.ratings[0].value,
                "AP" : this.ratings[0].value,
                "VVE" : this.ratings[0].value,
                "PLE" : this.ratings[0].value,
                "UST" : this.ratings[0].value,
                "ASM" : this.ratings[0].value,
                "RDS" : this.ratings[0].value
            },
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
      
        this.values = new Map(
            [
                ["RSR", new AttrVals(0.75, 0.88, 1.0, 1.15, 1.4, null)],
                ["SAD", new AttrVals(null, 0.94, 1.0, 1.08, 1.16, null)],
                ["CP", new AttrVals(0.70, 0.85, 1.0, 1.15, 1.3, 1.65)],
                ["RTPC", new AttrVals(null, null, 1.0, 1.11, 1.3, 1.66)],
                ["MC", new AttrVals(null, null, 1.0, 1.06, 1.21, 1.56)],
                ["VVME", new AttrVals(null, 0,87, 1.0, 1.15, 1.3, null)],
                ["RTT", new AttrVals(null, 0.87, 1.0, 1.07, 1.15, null)],
                ["AC", new AttrVals(1.46, 1.19, 1.0, 0.86, 0.71, null)], 
                ["SEC", new AttrVals(1.29, 1.13, 1.0, 0.91, 0.71, null)], 
                ["AP", new AttrVals(1.42, 1.17, 1.0, 0.86, 0.70, null)], 
                ["VVE", new AttrVals(1.21, 1.10, 1.0, 0.90, null, null)], 
                ["PLE", new AttrVals(1.14, 1.07, 1.0, 0.95, null, null)], 
                ["UST", new AttrVals(1.24, 1.10, 1.0, 0.91, 0.82, null)],
                ["ASM", new AttrVals(1.24, 1.10, 1.0, 0.91, 0.83, null)], 
                ["RDS", new AttrVals(1.23, 1.08, 1.0, 1.04, 1.10, null)], 
            ]
        )
        this.projectTypes = new Map([
            ["Org",  new ProjVals(3.2, 1.05, 2.5, 0.38)],
            ["Emb", new ProjVals(3.0, 1.12, 2.5, 0.35)],
            ["Sem", new ProjVals(2.8, 1.2,  2.5, 0.32)]])

        this.inputFieldsNames = ["size"]    
        this.handleInputUpdate = this.handleInputUpdate.bind(this)
        this.handleClear = this.handleClear.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.preflightClear = this.preflightClear.bind(this)
        this.handleProjTypeSel = this.handleProjTypeSel.bind(this)
        this.handleAttrRatUpdate = this.handleAttrRatUpdate.bind(this)
    }

    handleAttrRatUpdate(id, rating) {
        this.setState(Object.assign(this.state.attrs, 
        {
            [id] : rating
        }),
         ()=> console.log(this.state))
    }

    handleProjTypeSel(event) {
        const name = event.target.getAttribute('name')
        this.setState({projectType : name})
        this.checkErrors(this.state)
    }

    calcRes() {
        let EAF = () => {
            let totalProd = 1;
            [...Object.keys(this.state.attrs)].forEach(val => {
                let rating = this.state.attrs[val]
                let ratingValue = this.values.get(val)[rating]
                if (ratingValue) {
                    totalProd *= ratingValue
                }
            })

            return totalProd
        }
         
        
        let project = this.projectTypes.get(this.state.projectType);
        let PM = EAF() * project.a * ((this.state.size) ^ project.b)
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
                    <Attributes h="Attributes">
                        {[...this.values.entries()].map((val) => 
                            <CocomoAttr id={val[0]} ratings={this.ratings} handleRatingChange={this.handleAttrRatUpdate}/>
                            )}
                    </Attributes>
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