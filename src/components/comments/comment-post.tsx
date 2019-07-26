// DEPENDENCIES
import React from 'react';

const CommentPost = () => {
  return (
    <div className="commentpost__wrapper"> 
        <div className="commentpost__header_wrapper">
            <p className="font__comment_posted_name">Johnny</p>
            <p className="font__comment_posted_time">1min</p>
        </div>
        <div className="commentpost__content_wrapper">
            <p className="font__comment_posted_content">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    </div>
  );
}


export default CommentPost;
