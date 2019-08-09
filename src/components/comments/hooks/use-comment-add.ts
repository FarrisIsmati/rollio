// DEPENDENCIES
import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { array } from 'prop-types';

const useCommentAdd = () => {
    const [commentActive, setCommentActive] = useState<boolean>(false);
    const [commentBody, setCommentBody] = useState<string>('');
    const [commentName, setCommentName] = useState<string>('');
    const [numberOfComments, setNumberOfComments] = useState<number>(5);

    const commentBodyTextArea:any = useRef(null);

    useEffect(() => {
        return () => {
            setNumberOfComments(5);
        }
    })

    const getNamePlaceHolder = () => {
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

            if (commentName === '') {
                commentBodyTextArea.current.focus();
            }
        }
    }

    const blurComment = (e:any) => {
        const offFocusTarget:HTMLInputElement | HTMLTextAreaElement | null = e.relatedTarget;

        if (commentBody === '' && (offFocusTarget === null || (offFocusTarget.id !== 'commentBodyTextArea' && offFocusTarget.id !== 'commentNameInput'))) {

            // If you click on the share button then the focus will switch back to the comment body
            if (offFocusTarget !== null && offFocusTarget.id === 'commentAddButton') {
                commentBodyTextArea.current.focus();
                return;
            }

            setCommentActive(false);
        }
    }

    const showMoreComments = () => {
        setNumberOfComments(numberOfComments + 5);
    }

    return {
        commentActive,
        commentBody,
        commentName,
        numberOfComments,
        getNamePlaceHolder,
        clickNameInput,
        changeText,
        commentBodyTextArea,
        blurComment,
        showMoreComments
    }
}

export default useCommentAdd;