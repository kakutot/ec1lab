import React, {useEffect, useState} from 'react';
import '../index.css'

function CocomoAttr(props) {
    const [rating, setRating] = useState(props.ratings[0].value);

    const sendUpdateToParent = (event) => {
        setRating(event.currentTarget.value)
        props.handleRatingChange(props.id, event.currentTarget.value)
    }
  
    return (
                            <div className="attr">{props.id}
                                 <select onChange={(event) => 
                                     sendUpdateToParent(event)
                                 }>
                                         {
                                             props.ratings.map(({value, label}) => 
                                             (<option key={value} value={value}>{label}</option>))
                                         }
                                    </select>
                            </div>
    )}                

export default CocomoAttr;