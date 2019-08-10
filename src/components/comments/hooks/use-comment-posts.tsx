// DEPENDENCIES
import React, { useState } from 'react';

// COMPONENTS
import CommentPost from '../comment-post';

// INTERFACES
import { Comment } from '../interfaces';

const useCommentPosts = (props: any) => {
    const SetComment = (comment: Comment) => {
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

    return {
        shownComments,
        ShowMoreComments,
    }
}

export default useCommentPosts;