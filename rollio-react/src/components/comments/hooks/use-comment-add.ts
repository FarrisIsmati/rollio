// DEPENDENCIES
import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// REDUX
import { requestPostVendorComment } from '../../../redux/actions/data-actions';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

const useCommentAdd = (props:any) => {
    // Hooks
    const state = useGetAppState();

    // State
    const [commentActive, setCommentActive] = useState<boolean>(false);
    const [commentBody, setCommentBody] = useState<string>('');
    const [commentName, setCommentName] = useState<string>('');
    const [numberOfComments, setNumberOfComments] = useState<number>(5);
    const [commentErrorMessage, setCommentErrorMessage] = useState<string>('');

    // Refs
    const commentBodyTextArea:any = useRef(null);
    const currentSelectedVendorRef:any = useRef(state.data.selectedVendor.id);

    const resetComment = () => {
        setCommentErrorMessage(() => '');
        setCommentBody(() => '');
        setCommentName(() => '');
        setCommentActive(false);
    }

    useEffect(() => {
        // Reset comments box when you deselect a vendor
        if (currentSelectedVendorRef.current !== state.data.selectedVendor.id) {
            currentSelectedVendorRef.current = state.data.selectedVendor.id;
            resetComment();
        }

        // Upon unmounting reset number of comments to 5
        return () => {
            setNumberOfComments(5);
        }
    })

    const getNamePlaceHolder = () => {
        return commentActive === false ? 'Write a Comment' : 'Name';   
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

        const regionId = state.data.regionId;
        const vendorId = state.data.selectedVendor.id;

        // Timeout resets error message to default
        const resetCommentErrorMessage = () => {
            setTimeout(() => {
                setCommentErrorMessage(() => '');
            }, 3000);
        }


        try {
            const dispatchRes:any = await dispatch( requestPostVendorComment({ regionId, vendorId, name: commentName, text: commentBody }) )
            const httpStatus = dispatchRes.response ? dispatchRes.response.status : dispatchRes.status;
            if (httpStatus === 429) {
                setCommentErrorMessage(() => 'Comment limit reached');
                resetCommentErrorMessage();
            } else if (httpStatus === 200) {
                // Upon Successful message sent clean up add comment
                resetComment();
                
            } else {
                setCommentErrorMessage(() => 'Error: your comment could not be submitted');
                resetCommentErrorMessage();
            }
        } catch (error) {
            setCommentErrorMessage(() => 'Error: your comment could not be submitted');
            resetCommentErrorMessage();
        }
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
