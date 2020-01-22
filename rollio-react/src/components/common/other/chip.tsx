// DEPENDENCIES
import React from 'react';

export interface ChipProps {
    text: string
}

const Chip = (props: ChipProps) => { 
    return (
        <div className="chip__wrapper">
            <p className="font__chip">{ props.text }</p>
        </div>
    );
}

export default Chip;
