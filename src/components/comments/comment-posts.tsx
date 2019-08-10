// DEPENDENCIES
import React, { useState, useEffect } from 'react';

// COMPONENTS
import CommentPost from './comment-post';
import ButtonDefault from '../common/buttons/button-default';

// INTERFACES
import { Comment } from './interfaces';

const CommentPosts = (props: any) => {
    const setComment = (comment: Comment) => <CommentPost key={comment._id} name={comment.name} time={comment.commentDate} text={comment.text}/>

    let initialComments

    if (props.comments.length >= 5) {
      initialComments = props.comments.slice(0, 5).map(setComment);
    } else {
      initialComments = props.comments.map(setComment)
    }

    const [shownComments, setShownComments] = useState(initialComments);

    const showMoreComments = () => {
      const commentsLength = props.comments.length;
      const targetLength = shownComments.length + 10;

      if (shownComments.length === commentsLength) {
        return
      }

      if (targetLength < commentsLength) {
        setShownComments(props.comments.slice(0, targetLength).map(setComment))
      } else {
        setShownComments(props.comments.map(setComment))
      }
    }

    return (
      <div className='commentposts__wrapper'>
        { shownComments }
        <ButtonDefault 
          id={'commentShowMoreButton'} 
          text={'Show More'} 
          className={'button__default_wide font__button_comment_showmore'}
          isLocked={() => shownComments.length === props.comments.length}
          handleClick={showMoreComments}
        />
      </div>
    )
  }
  
export default CommentPosts