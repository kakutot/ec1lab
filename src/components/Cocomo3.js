import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import '../index.css'
import {ProjVals} from './Cocomo1'
import CocomoAttr from './CocomoAttr'
import Attributes from './Attributes'

class AttrVals {
    constructor(exlow = 0, hlow, low, med, high, vhigh, crit) {
        this.exlow = exlow;
        this.hlow = hlow;
        this.low = low;
        this.med = med;
        this.high = high;
        this.vhigh = vhigh;
        this.crit = crit;
        }
}

export class Cocomo3 extends React.Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.ratings = [
            {value : "exlow",  label : "Extra low"},
            {value : "hlow",  label : "Very low"},
            {value : "low" ,  label : "Low",},
            {value :"med", label : "Medium"},
            {value : "high", label : "High"},
            {value : "vhigh", label : "Very high"},
            {value : "crit", label : "Critical"}]
        this.scaleFactorValues = new Map(
            [
                ["PREC", new AttrVals(6.20, 4.96, 3.72, 2.48, 1.24, 0)],
                ["FLEX", new AttrVals(5.07, 4.05, 3.04, 2.03, 1.01, 0)],
                ["RESL", new AttrVals(7.07, 5.65, 4.24, 2.83, 1.41, 0)],
                ["TEAM", new AttrVals(5.48, 4.38, 3.29, 2.19, 1.1, 0)],
                ["PMAT", new AttrVals(7.8, 6.24, 4.68, 3.12, 1.56, 0)],
            ]
        )
        this.effortMultipliersValues = new Map(
            [
                ["PERS", new AttrVals(2.12, 1.62, 1.26, 1, 0.83, 0.63, 0.5)],
                ["FREX", new AttrVals(1.59, 1.33, 1.22, 1.00, 0.87, 0.74, 0.62)],
                ["RCPX", new AttrVals(0.49, 0.60, 0.83, 1.00, 1.33, 1.91, 2.72)],
                ["RUSE", new AttrVals(null, null, 0.95, 1.00, 1.07, 1.15, 1.24)],
                ["PDIF", new AttrVals(null, null, 0.87, 1.00, 1.29, 1.81, 2.61)],
                ["FCIL", new AttrVals(1.43, 1.3, 1.1, 1.00, 0.87, 0.73, 0.62)],
                ["SCED", new AttrVals(null, 1.43, 1.14, 1.00, 1.00, null, null)],
            ]
        )
        this.state = {
            "size" : 0,
            scaleFactors : {
                "PREC" : this.ratings[0].value,
                "FLEX" : this.ratings[0].value,
                "RESL"  : this.ratings[0].value,
                "TEAM" : this.ratings[0].value,
                "MC" : this.ratings[0].value,
                "PMAT" : this.ratings[0].value,
            },
            effortMultipliers : {
                "PERS" : this.ratings[0].value,
                "FREX" : this.ratings[0].value,
                "RCPX"  : this.ratings[0].value,
                "PDIF" : this.ratings[0].value,
                "FCIL" : this.ratings[0].value,
                "SCED" : this.ratings[0].value,
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
        this.handleScaleFactorsUpdate = this.handleScaleFactorsUpdate.bind(this)
        this.handleEffortMultipliersUpdate = this.handleEffortMultipliersUpdate.bind(this)
    }

    handleScaleFactorsUpdate(id, rating) {
        this.setState(Object.assign(this.state.scaleFactors, 
        {
            [id] : rating
        }),
         ()=> console.log(this.state))
    }

    handleEffortMultipliersUpdate(id, rating) {
        this.setState(Object.assign(this.state.effortMultipliers, 
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
        let EAF = (filtVal) => {
            let totalProd = 1;
            [...Object.keys(this.state.effortMultipliers)].forEach(val => {
                if (val !== filtVal) {
                    let rating = this.state.effortMultipliers[val]
                    let ratingValue = this.effortMultipliersValues.get(val)[rating]
                    if (ratingValue) {
                        totalProd *= ratingValue
                    }
                }
            })

            return totalProd
        }

        let SFsum = () => {
            let totalSum = 0;
            [...Object.keys(this.state.scaleFactors)].forEach((val, index) => {
                if (index < 5) {
                    let rating = this.state.scaleFactors[val]
                    let ratingValue = this.scaleFactorValues.get(val)[rating]
                    if (ratingValue) {
                        totalSum += ratingValue
                    }
                }   
            })

            return totalSum
        }

        let B = 0.91;
        let A = 2.94;
        let C = 3.67;
        let D = 0.28;
        
        let E = B + 0.01 * SFsum
        let PM = (filter) => EAF(filter) * A * ((this.state.size) ^ E)

        let PMval = PM()

        let scedrating = this.state.effortMultipliers["SCED"]
        let scedratingValue = this.effortMultipliersValues.get("SCED")[scedrating]
        let pmSced = PM("SCED")

        let TM = scedratingValue === null ? null : scedratingValue * ((pmSced) ^ (D + 0.2*(E - B)))
        let SS = scedratingValue === null ? null : PMval/TM
        let P = this.state.size/PMval
        
        let toFix2 = (val) => parseFloat(val).toFixed(2);

        return `PM = ${toFix2(PMval)} \nTM = ${toFix2(TM)} \nSS = ${toFix2(SS)} \nP = ${toFix2(P)}`
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
                    })
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
                    <Attributes h="Scale factors">
                        {[...this.scaleFactorValues.entries()].map((val) => 
                            <CocomoAttr h="Scale factors" id={val[0]} ratings={(() => 
                                this.ratings.filter((val) => val.value !== "exlow"))()} handleRatingChange={this.handleScaleFactorsUpdate}/>
                            )}
                   </Attributes>
                   <Attributes h="Effort multi">
                        {[...this.effortMultipliersValues.entries()].map((val) => 
                            <CocomoAttr id={val[0]} ratings={this.ratings} handleRatingChange=
                            {this.handleEffortMultipliersUpdate}/>
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