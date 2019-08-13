// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentSection from '../comments/comment-section';

// HOOKS
import useVendorData from './hooks/use-vendor-data';

const TruckProfile = () => {
  const { FetchVendorProfileData, GetCommentsFromState } = useVendorData();

  FetchVendorProfileData({ 
    regionId: '5d50bc3f6013b802bcaec400',
    vendorId: '5d50bc3f6013b802bcaec408'
  });

  return (
    <div className="truckprofile__wrapper"> 
        <CommentSection getComments={GetCommentsFromState} />
    </div>
  );
}


export default TruckProfile;
