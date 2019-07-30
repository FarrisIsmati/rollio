// DEPENDENCIES
import React, { KeyboardEvent, useState, ChangeEvent} from 'react';

const useTextAreaGrow = () => {
    const [rows, setRows] = useState<number>(1);

    const keyPress = (e:KeyboardEvent<HTMLTextAreaElement>) => {
        // If hit return key
        if (e.keyCode === 13) {
            setRows(rows + 1);
        }

        if (e.keyCode === 8) {
            const textAreaArr:Array<string> = e.currentTarget.value.split('\n');
            const lastLine:string = textAreaArr[textAreaArr.length - 1];

            if (rows > 1 && lastLine === '') {
                console.log('remove');
                setRows(rows - 1);
            }
        }
    }

    return {
        rows,
        keyPress
    }
}

export default useTextAreaGrow;