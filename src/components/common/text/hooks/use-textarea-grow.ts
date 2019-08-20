// DEPENDENCIES
import React, { useEffect, useState, ChangeEvent} from 'react';

interface tempChangeEvent  {
    target: {
        rows: number,
        scrollHeight: number
    }
}

const useTextAreaGrow = (ref: any) => {
    const [rows, setRows] = useState<number>(1);
    const [minRows] = useState<number>(1);

    useEffect(() => {
        const tempChangeEvent:tempChangeEvent = {
            target: {
                rows: ref.current.rows,
                scrollHeight: ref.current.scrollHeight
            }
        }

        // Initialize height on render
        textAreaHandleChange(tempChangeEvent)
    }, [])

    const textAreaHandleChange = (e:ChangeEvent<HTMLTextAreaElement> | tempChangeEvent) => {
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