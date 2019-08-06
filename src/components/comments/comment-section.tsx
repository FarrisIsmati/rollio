// DEPENDENCIES
import React, {FC} from 'react';

// COMPONENTS
import CommentPost from './comment-post';
import CommentAdd from './comment-add';

const CommentSection = () => {
  // In Redux when opening up this page (This page being the truck profile)
  // Load all truck profile into state
  // Use comments of truck from the props passed in from redux state
  // Create an array of comment posts 
  return (
    <div className="commentsection__wrapper"> 
        <CommentAdd />
        <CommentPost name={'Jim'} time={'1min'} text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}/>
    </div>
  );
}


export default CommentSection;
