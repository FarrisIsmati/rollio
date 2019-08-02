// DEPENDENCIES
import React from 'react';

export interface ButtonProps {
    text: string,
    id: string,
    className: string,
    isLocked: () => boolean
}

const ButtonDefault = (props: ButtonProps) => {    
    let lockedStatusClass = props.isLocked() ? 'button__default_locked' : '';

    return (
        <button 
            id={props.id} 
            className={props.className + ' button__default ' + lockedStatusClass}
            tabIndex={0}
        >
            {props.text}
        </button>
    );
}

// ADD OPTION FOR BUTTON LOCK STATE 


export default ButtonDefault;
