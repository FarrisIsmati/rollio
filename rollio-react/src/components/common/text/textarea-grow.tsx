// DEPENDENCIES
import React, { ChangeEvent} from 'react';

// HOOKS
import useHandleTextAreaChange from './hooks/use-handle-text-area-change';

interface TextAreaGrowProps  {
    id: string,
    onChange: (e:ChangeEvent<HTMLTextAreaElement>) => void,
    onBlur: (e:any) => void,
    placeholder: string,
    className: string,
    value: string
}

const TextAreaGrowable = React.forwardRef((props: TextAreaGrowProps, ref: any) => {
    const { rows, textAreaHandleChange } = useHandleTextAreaChange(ref);

    return (
        <textarea 
            id={props.id} 
            className={props.className}
            placeholder={props.placeholder}
            tabIndex={0} 
            value={props.value}
            onBlur={props.onBlur}
            onChange={(e) => {props.onChange(e); textAreaHandleChange(e)}} 
            ref={ref}
            rows={rows}
        ></textarea>
    );
})

export default TextAreaGrowable;
