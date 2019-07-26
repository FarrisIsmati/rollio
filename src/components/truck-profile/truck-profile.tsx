// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentPost from '../comments/comment-post';
import CommentAdd from '../comments/comment-add';

const TruckProfile = () => {
  return (
      // Mobile resize this flex centers
    <div className="truckprofile__wrapper"> 
        <CommentAdd/>
        {/* <CommentPost/> */}
    </div>
  );
}


export default TruckProfile;
