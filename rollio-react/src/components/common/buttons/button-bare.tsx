// DEPENDENCIES
import React from 'react';

export interface ButtonProps {
    text: string,
    id: string,
    className?: string,
    overrideClassName?: string,
    isLocked?: () => boolean,
    handleClick: () => any
}

const ButtonBare = (props: ButtonProps) => {
    let optionalProps = { className: '', overrideClassName: '', isLocked: () => false };

    if (props.className) {
        optionalProps.className = props.className;
    }
    if (props.overrideClassName) {
        optionalProps.overrideClassName = props.overrideClassName;
    }
    if (props.isLocked) {
        optionalProps.isLocked = props.isLocked;
    }

    let disabled = optionalProps.isLocked();

    let lockedStatusClass = disabled ? 'button__bare_locked' : '';

    const defaultClassName = optionalProps.overrideClassName ? ` ${optionalProps.overrideClassName} ` : ' button__bare ';

    return (
        <button
            id={props.id}
            className={optionalProps.className + defaultClassName + lockedStatusClass}
            tabIndex={0}
            onClick={props.handleClick}
            disabled={disabled}
        >
            {props.text}
        </button>
    );
}

// ADD OPTION FOR BUTTON LOCK STATE

export default ButtonBare;
