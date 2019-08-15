// DEPENDENCIES
import React, { useState, useEffect } from 'react';
import moment from 'moment';

// COMPONENTS
import CommentPost from '../comment-post';

// INTERFACES
import { Comment } from '../interfaces';

const useCommentPosts = (props: any) => {
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

    if (props.comments.length >= 5) {
        initialComments = props.comments.slice(0, 5).map(SetComment);
    } else {
        initialComments = props.comments.map(SetComment)
    }

    const [shownComments, setShownComments] = useState(initialComments);

    const ShowMoreComments = () => {
        const commentsLength = props.comments.length;
        const targetLength = shownComments.length + 10;

        if (shownComments.length === commentsLength) {
            return
        }

        if (targetLength < commentsLength) {
            setShownComments(props.comments.slice(0, targetLength).map(SetComment))
        } else {
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

export default useCommentPosts;