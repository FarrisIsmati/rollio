// DEPENDENCIES
import React, { useState, useEffect } from 'react';
import moment from 'moment';

// COMPONENTS
import CommentPost from '../comment-post';

// INTERFACES
import { Comment } from '../interfaces';

const useRenderPosts = (props: any) => {
    // Initital amount of comments needed to be shown before activating show more comments feature
    const initalCommentsLength = 5;

    const SetComment = (comment: Comment) => {
        if (comment.name === '') {
            comment.name = 'Some Dude';
        }

        if (comment.commentDate === '') {
            comment.commentDate = moment().subtract(30, 'seconds').format('YYYY-MM-DDTHH:mm:SS.sss');
        }

        return (
            <CommentPost key={comment._id} name={comment.name} time={comment.commentDate} text={comment.text}/>
        )
    }

    let initialComments;

    if (props.comments.length >= initalCommentsLength) {
        initialComments = props.comments.slice(0, initalCommentsLength).map(SetComment);
    } else {
        initialComments = props.comments.map(SetComment)
    }

    // Currently shown comments
    const [shownComments, setShownComments] = useState(initialComments);
    // If a user adds a comment & less than the initalCommentsLength is shown show all the comments
    useEffect(() => {
        if (props.comments.length <= initalCommentsLength && shownComments.length < props.comments.length) {
            setShownComments(props.comments.map(SetComment))
        }
    })

    const ShowMoreComments = () => {
        const commentsLength = props.comments.length;
        const targetLength = shownComments.length + 10;

        if (shownComments.length === commentsLength) {
            return
        }

        // If newly shown comments length is less than total number of existing comments show it up to the target length slice
        if (targetLength < commentsLength) {
            setShownComments(props.comments.slice(0, targetLength).map(SetComment))
        } else {
        // Else show all the comments
            setShownComments(props.comments.map(SetComment))
        }
    }
    
    // Only render if comments array has changed changed in size
    useEffect(() => {
        setShownComments(props.comments.slice(0, shownComments.length).map(SetComment))
    }, [props.comments.length])

    return {
        shownComments,
        ShowMoreComments,
    }
}

export default useRenderPosts;