// DEPENDENCIES
import React from 'react';
import  { useDispatch  } from 'react-redux';

// COMPONENTS
import CommentSection from '../comments/comment-section';

// ACTIONS
import { fetchVendorProfile } from '../../redux/actions/data-actions';

// REDUX CONSTANTS
import { RECIEVE_VENDOR_PROFILE } from '../../redux/constants/constants';

const TruckProfile = () => {
  const dispatch = useDispatch();

  dispatch(
    fetchVendorProfile({ 
      regionId: '5d1f9acc3d1ed51898543a72',
      vendorId: '5d1f9acd3d1ed51898543a7a'
    })
  )

  return (
      // Mobile resize this flex centers
    <div className="truckprofile__wrapper"> 
        <CommentSection />
    </div>
  );
}


export default TruckProfile;
