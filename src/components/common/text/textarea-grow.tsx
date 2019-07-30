// DEPENDENCIES
import React, {FC} from 'react';

// HOOKS
import useTextAreaGrow from './hooks/use-textarea-grow';

const TextAreaGrowable:FC = () => {
    const { rows, keyPress } = useTextAreaGrow();

    return (
        <textarea id='commentBodyTextArea' tabIndex={0} onKeyDown={keyPress} rows={rows}></textarea>
    );
}


export default TextAreaGrowable;
