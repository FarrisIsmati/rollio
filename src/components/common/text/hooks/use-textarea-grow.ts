// DEPENDENCIES
import React, { KeyboardEvent, useState, ChangeEvent} from 'react';

const useTextAreaGrow = () => {
    const [rows, setRows] = useState<number>(1);
    const [minRows] = useState<number>(1);

    const textAreaHandleChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        const textAreaLineHeight = 20;
       
		const previousRows = e.target.rows;
        e.target.rows = minRows;

        const currentRows = ~~(e.target.scrollHeight / textAreaLineHeight);

        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }

        setRows(currentRows);
    }

    return {
        rows,
        textAreaHandleChange
    }
}

export default useTextAreaGrow;