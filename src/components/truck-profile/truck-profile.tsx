// DEPENDENCIES
import React from 'react';

// COMPONENTS
import CommentSection from '../comments/comment-section';

// HOOKS
import useVendorData from './hooks/use-vendor-data';

const TruckProfile = () => {
  const { FetchVendorProfileData, GetCommentsFromState } = useVendorData();

  FetchVendorProfileData({ 
    regionId: '5d1f9acc3d1ed51898543a72',
    vendorId: '5d1f9acd3d1ed51898543a7e'
  });

  return (
      // Mobile resize this flex centers
    <div className="truckprofile__wrapper"> 
        <CommentSection getComments={GetCommentsFromState}/>
    </div>
  );
}


export default TruckProfile;
