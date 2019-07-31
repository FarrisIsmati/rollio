// DEPENDENCIES
import React, {FC, ChangeEvent} from 'react';

// HOOKS
import useTextAreaGrow from './hooks/use-textarea-grow';

interface TextAreaGrowProps  {
    id: string,
    onChange: (e:ChangeEvent<HTMLTextAreaElement>) => void,
    onBlur: (e:any) => void
}

const TextAreaGrowable:FC<TextAreaGrowProps> = (props) => {
    const { rows, textAreaHandleChange } = useTextAreaGrow();

    return (
        <textarea 
            id={props.id} 
            className='textarea__grow font__textarea_grow' 
            tabIndex={0} 
            onBlur={props.onBlur}
            onChange={(e) => {props.onChange(e); textAreaHandleChange(e)}} 
            rows={rows}
        ></textarea>
    );
}


export default TextAreaGrowable;
