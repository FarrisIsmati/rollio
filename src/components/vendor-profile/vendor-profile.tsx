// DEPENDENCIES
import React from 'react';
import { withRouter } from 'react-router';

// COMPONENTS
import CommentSection from '../comments/comment-section';
import VendorData from './vendor-data';

// UTILS
import { getRouteIds } from '../../util/index';

// HOOKS
import useVendorData from './hooks/use-vendor-data';

const VendorProfile = (props:any) => {
  const { FetchVendorProfileData, GetCommentsFromState, GetVendorDataFromState } = useVendorData;

  const regionId = getRouteIds(props).regionId;
  const vendorId = getRouteIds(props).vendorId;

  // This data will be taken from the route
  FetchVendorProfileData({ 
    regionId: regionId,
    vendorId: vendorId
  });

  return (
    <div className='vendorprofile__wrapper'>
      {/* <div className='vendorprofile__twitterwidget_wrapper'>
        tst
      </div> */}
      <div className='vendorprofile__top_wrapper'>
        <VendorData getVendorData={GetVendorDataFromState} />
      </div>
      <div className='vendorprofile__bottom_wrapper'>
        <CommentSection getComments={GetCommentsFromState} />
      </div>
    </div>
  );
}

export default withRouter(VendorProfile);
