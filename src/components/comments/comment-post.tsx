// DEPENDENCIES
import React, {FC} from 'react';

interface CommentPostProps  {
  time: string,
  name: string,
  text: string
}

const CommentPost = (props: CommentPostProps) => {
  return (
    <div className="commentpost__wrapper"> 
        <div className="commentpost__header_wrapper">
            <p className="font__comment_posted_name">{ props.name }</p>
            <p className="font__comment_posted_time">{ props.time }</p>
        </div>
        <div className="commentpost__content_wrapper">
            <p className="font__comment_posted_content">{ props.text }</p>
        </div>
    </div>
  );
}


export default CommentPost;
