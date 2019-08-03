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


  // THINK THIS THROUGH ASK QUESTIONS SEE EXAMPLES HOW U DO THIS WIT MONGO? IDK FIGURE IT OUT
  // SHOULD I EVEN WASTE MY TIME ON THIS?? IDKKKKK
  // ACTUALLY WHEN YOU GET TRUCK DATA ONLY GET 25 COMMENTS AT A TIME
    // MUST MODIFY GET TRUCK DATA BY ONLY LOADING IN FIRST 25 COMMENTS
  // CREATE A ROUTE TO GET 25 MORE COMMENTS
  // WHEN YOU CLICK LOAD MORE YOUR ADDING MORE TO THE REDUX STATE

  return (
    <div className="commentsection__wrapper"> 
        <CommentAdd />
        <CommentPost name={'Jim'} time={'1min'} text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}/>
    </div>
  );
}


export default CommentSection;
