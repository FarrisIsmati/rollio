// DEPENDENCIES
import React from 'react';

// HOOKS
import useCommentPost from './hooks/use-comment-post';

// INTERFACES
import { CommentPostProps } from './interfaces';

const CommentPost = (props: CommentPostProps) => {
  const { GetTime } = useCommentPost(props);

  return (
    <div className="commentpost__wrapper">
        <div className="commentpost__header_wrapper">
            <p className="font__comment_posted_name">{ props.name }</p>
            <p className="font__comment_posted_time">{ GetTime() }</p>
        </div>
        <div className="commentpost__content_wrapper">
            <p className="font__comment_posted_content">{ props.text }</p>
        </div>
    </div>
  );
}


export default CommentPost;
