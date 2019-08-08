// DEPENDENCIES
import React, {FC} from 'react';

// COMPONENTS
import CommentPost from './comment-post';
import CommentPostEmpty from './comment-post-empty';
import CommentAdd from './comment-add';

interface Comment {
  _id: string,
  name: string,
  commentDate: string,
  text: string
}

interface CommentSectionProps {
  getComments: () => Comment[]
}

const CommentSection = (props:CommentSectionProps) => {
  const comments: Comment[] = props.getComments();

  const commentArray = !comments.length ? 
    <CommentPostEmpty /> :
    comments.map((comment: Comment) =>
      <CommentPost key={comment._id} name={comment.name} time={comment.commentDate} text={comment.text}/>
    );

  return (
    <div className="commentsection__wrapper"> 
        <CommentAdd />
        { commentArray }
    </div>
  );
}


export default CommentSection;
