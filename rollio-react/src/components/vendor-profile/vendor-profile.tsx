// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentSection from '../comments/comment-section';
import VendorData from './vendor-data';

// HOOKS
import useGetVendorData from './hooks/use-get-vendor-data';
import useGetAppState from '../common/hooks/use-get-app-state';

const VendorProfile = (props:any) => {
  // const state = useGetAppState();

  // useGetVendorData({ 
  //   regionId: state.data.regionId,
  //   vendorId: props.vendorId,
  //   history: props.history
  // })

  // const vendorData = useGetAppState().data.selectedVendor
  // const comments = useGetAppState().data.selectedVendor.comments

  // // Render Content
  // const content = useGetAppState().loadState.isVendorLoaded ?
  //   <React.Fragment>
  //     {/* <div className='vendorprofile__twitterwidget_wrapper'>
  //       tst
  //     </div> */}
  //     <div className='vendorprofile__top_wrapper'>
  //       <VendorData vendorData={vendorData} />
  //     </div>
  //     <div className='vendorprofile__bottom_wrapper'>
  //       <CommentSection comments={comments} />
  //     </div>
  //   </React.Fragment>
  // : <p>loading</p>

  console.log(props)
  return (
    <div className='vendorprofile__wrapper'>
      {/* { content } */}
      <p>lol fuck man</p>
    </div>
  );
}

export default VendorProfile;
