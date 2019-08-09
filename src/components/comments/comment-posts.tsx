// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentPost from './comment-post';

// INTERFACES
import { Comment } from './interfaces';

const CommentPosts = (props: any) => {
    // HERE MOVE THE FUNCTIONALITY INTO A HOOK,
    // SHOW MORE COMMENTS PER LOADMORE :)
    return props.comments.map((comment: Comment) =>
      <CommentPost key={comment._id} name={comment.name} time={comment.commentDate} text={comment.text}/>
    );
  }
  
export default CommentPosts