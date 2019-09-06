// DEPENDENCIES
import React from 'react';
import { withRouter } from 'react-router';

// COMPONENTS
import CommentSection from '../comments/comment-section';
import VendorData from './vendor-data';

// UTILS
import { getRouteIds } from '../../util/index';

// HOOKS
import useGetVendorData from './hooks/use-get-vendor-data';
import useGetAppState from '../common/hooks/use-get-app-state';

const VendorProfile = (props:any) => {
  useGetVendorData({ 
    regionId: getRouteIds(props).regionId,
    vendorId: getRouteIds(props).vendorId,
    history: props.history
  })

  const vendorData = useGetAppState().data.selectedVendor
  const comments = useGetAppState().data.selectedVendor.comments

  // Render Content
  const content = useGetAppState().async.isVendorLoaded ?
    <React.Fragment>
      {/* <div className='vendorprofile__twitterwidget_wrapper'>
        tst
      </div> */}
      <div className='vendorprofile__top_wrapper'>
        <VendorData vendorData={vendorData} />
      </div>
      <div className='vendorprofile__bottom_wrapper'>
        <CommentSection comments={comments} />
      </div>
    </React.Fragment>
  : <p>loading</p>


  return (
    <div className='vendorprofile__wrapper'>
      { content }
    </div>
  );
}

export default withRouter(VendorProfile);
