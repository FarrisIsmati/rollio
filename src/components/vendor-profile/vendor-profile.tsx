// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentSection from '../comments/comment-section';
import { withRouter } from 'react-router';

// HOOKS
import useVendorData from './hooks/use-vendor-data';

const TruckProfile = (props:any) => {
  const { FetchVendorProfileData, GetCommentsFromState } = useVendorData;
  const routeLocation = props.location.pathname.substr(1).split('/');

  // This data will be taken from the route
  FetchVendorProfileData({ 
    regionId: routeLocation[0],
    vendorId: routeLocation[1]
  });

  return (
    <div className='vendorprofile__wrapper'>
      <div className='vendorprofile__top_wrapper'>
        <p> lol </p>
      </div>
      <div className='vendorprofile__bottom_wrapper'>
        <CommentSection getComments={GetCommentsFromState} />
      </div>
    </div>
  );
}

export default withRouter(TruckProfile);
