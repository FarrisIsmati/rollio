// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentPost from '../comments/comment-post';
import CommentAdd from '../comments/comment-add';

const TruckProfile = () => {
  return (
      // Mobile resize this flex centers
    <div className="truckprofile__wrapper"> 
        {/* <CommentAdd/> */}
        <CommentPost name={'Jim'} time={'1min'} text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}/>
    </div>
  );
}


export default TruckProfile;
