// DEPENDENCIES
import React from 'react';

export interface ButtonProps {
    text: string,
    id: string,
    className: string
}

const ButtonDefault = (props: ButtonProps) => {
    return (
        <button 
            id={props.id} 
            className={props.className + ' button__default'}
            tabIndex={0}
        >
            {props.text}
        </button>
    );
}

// ADD OPTION FOR BUTTON LOCK STATE 


export default ButtonDefault;
