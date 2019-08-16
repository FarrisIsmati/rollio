// DEPENDENCIES
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// COMPONENTS
import CommentSection from '../comments/comment-section';

// REDUX
import { fetchRegionData } from '../../redux/actions/data-actions';

// HOOKS
import useVendorData from './hooks/use-vendor-data';

const TruckProfile = () => {
  const { FetchVendorProfileData, GetCommentsFromState } = useVendorData();
  
  // When ready load up on the page that requires it (Main map page)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch( fetchRegionData({ regionName: 'WASHINGTONDC' }))
  }, [])

  // This data will be taken from the route
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
