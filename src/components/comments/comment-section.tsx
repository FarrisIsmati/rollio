// DEPENDENCIES
import React, {FC} from 'react';

// COMPONENTS
import CommentPosts from './comment-posts';
import CommentPostEmpty from './comment-post-empty';
import CommentAdd from './comment-add';

// INTERFACES
import { Comment, CommentSectionProps } from './interfaces';

const CommentSection = (props: CommentSectionProps) => {
  const comments: Comment[] = props.getComments();

  const commentsArray = !comments.length ? 
    <CommentPostEmpty /> :
    <CommentPosts comments={comments}/>;

  return (
    <div className="commentsection__wrapper"> 
        <CommentAdd />
        { commentsArray }
    </div>
  );
}


export default CommentSection;
