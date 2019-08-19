// DEPENDENCIES
import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// ACTIONS
import { requestPostVendorComment } from '../../../redux/actions/data-actions';
import { AxiosResponse } from 'axios';


const useCommentAdd = () => {
    const [commentActive, setCommentActive] = useState<boolean>(false);
    const [commentBody, setCommentBody] = useState<string>('');
    const [commentName, setCommentName] = useState<string>('');
    const [numberOfComments, setNumberOfComments] = useState<number>(5);
    const [commentErrorMessage, setCommentErrorMessage] = useState<string>('');
    const commentBodyTextArea:any = useRef(null);

    useEffect(() => {
        // Upon unmounting reset number of comments to 5
        return () => {
            setNumberOfComments(5);
        }
    })

    const getNamePlaceHolder = () => {
        return commentActive === false ? 'Be the first to share your thoughts...' : 'Add your name (optional)';   
    }

    const getIsLocked = () => {
        return commentBody === '';
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

    const dispatch = useDispatch();

    const dispatchRequestPostVendorComment = async () => {
        if (commentBody === '') {
            return
        }
        const dispatchRes:any = await dispatch( requestPostVendorComment({ regionId: '5d50bc3f6013b802bcaec400', vendorId: '5d50bc3f6013b802bcaec408', name: commentName, text: commentBody }) )

        const httpStatus = dispatchRes.response ? dispatchRes.response.status : dispatchRes.status;

        if (httpStatus === 429) {
            setCommentErrorMessage(() => 'You can only comment on this vendor once per day');
        } else if (httpStatus === 200) {
            setCommentErrorMessage(() => '');
        } else {
            setCommentErrorMessage(() => 'Error: your comment could not be submitted');
        }

        return dispatchRes;
    }

    const showMoreComments = () => {
        setNumberOfComments(numberOfComments + 5);
    }

    return {
        commentActive,
        commentBody,
        commentName,
        commentErrorMessage,
        numberOfComments,
        getNamePlaceHolder,
        getIsLocked,
        clickNameInput,
        changeText,
        commentBodyTextArea,
        blurComment,
        showMoreComments,
        dispatchRequestPostVendorComment
    }
}

export default useCommentAdd;
