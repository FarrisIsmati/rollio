// DEPENDENCIES
import React, { ChangeEvent, useState, useRef } from 'react';

const useCommentAdd = () => {
    const [commentActive, setCommentActive] = useState<boolean>(false);
    const [commentBody, setcommentBody] = useState<string>('');
    const [commentName, setcommentName] = useState<string>('');

    const commentBodyInput:any = useRef(null);

    const namePlaceHolder = () => {
        return commentActive === false ? 'Be the first to share your thoughts...' : 'Add your name (optional)';   
    }

    const changeText = (e:ChangeEvent<HTMLInputElement>, input:string) => {
        if (input === 'body') {
            setcommentBody(e.target.value);
        } else if (input === 'name') {
            setcommentName(e.target.value);
        }
    }

    const clickNameInput = (e:React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        if (!commentActive) {
            setCommentActive(true);
            commentBodyInput.current.focus();
        }
    }

    return {
        commentActive,
        commentBody,
        commentName,
        namePlaceHolder,
        clickNameInput,
        changeText,
        commentBodyInput
    }
}

export default useCommentAdd;

// Follow this tut
// https://www.youtube.com/watch?v=3WQUItcK-j0

// Maybe this one too
// https://www.youtube.com/watch?v=oQZJxyMoLws