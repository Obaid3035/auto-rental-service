import React from 'react';
import './Spinner.css'

const OverLaySpinner = (props: {isActive: boolean}) => {
    let spinner = null;
    if (props.isActive) {
        spinner = (
            <div className="spinner">
                <div className="lds-hourglass" />
            </div>
        )
    }

    return spinner
};

export default OverLaySpinner;
