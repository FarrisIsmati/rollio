// DEPENDENCIES
import React, { ChangeEvent, useState, useRef } from 'react';

const useCommentAdd = () => {
    const [commentActive, setCommentActive] = useState<boolean>(false);
    const [commentBody, setCommentBody] = useState<string>('');
    const [commentName, setCommentName] = useState<string>('');

    const commentBodyInput:any = useRef(null);

    const namePlaceHolder = () => {
        return commentActive === false ? 'Be the first to share your thoughts...' : 'Add your name (optional)';   
    }

    const changeText = (e:ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>, input:string) => {
        if (input === 'body') {
            setCommentBody(e.target.value);
        } else if (input === 'name') {
            setCommentName(e.target.value);
        }
    }

    const clickNameInput = (e:React.FocusEvent<HTMLInputElement>) => {
        if (!commentActive) {
            setCommentActive(true);
            commentBodyInput.current.focus();
        }
    }

    const blurComment = (e:any) => {
        const offFocusTarget:HTMLInputElement | HTMLTextAreaElement | null = e.relatedTarget;

        if (commentBody === '' && (offFocusTarget === null || (offFocusTarget.id !== 'commentBodyTextArea' && offFocusTarget.id !== 'commentBody'))) {
            setCommentActive(false);
        }
    }

    return {
        commentActive,
        commentBody,
        commentName,
        namePlaceHolder,
        clickNameInput,
        changeText,
        commentBodyInput,
        blurComment
    }
}

export default useCommentAdd;

// Follow this tut
// https://www.youtube.com/watch?v=3WQUItcK-j0

// Maybe this one too
// https://www.youtube.com/watch?v=oQZJxyMoLws