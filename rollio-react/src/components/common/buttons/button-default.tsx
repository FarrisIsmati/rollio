// DEPENDENCIES
import React from 'react';

export interface ButtonProps {
    text: string,
    id: string,
    className?: string,
    isLocked?: () => boolean,
    handleClick: () => any
}

const ButtonDefault = (props: ButtonProps) => {
    let optionalProps = { className: '', isLocked: () => false };

    if (props.className) {
        optionalProps.className = props.className;
    }
    if (props.isLocked) {
        optionalProps.isLocked = props.isLocked;
    }

    let disabled = optionalProps.isLocked()

    let lockedStatusClass = disabled ? 'button__default_locked' : '';

    return (
        <button
            id={props.id}
            className={optionalProps.className + ' button__default ' + lockedStatusClass}
            tabIndex={0}
            onClick={props.handleClick}
            disabled={disabled}
        >
            {props.text}
        </button>
    );
}

// ADD OPTION FOR BUTTON LOCK STATE

export default ButtonDefault;
