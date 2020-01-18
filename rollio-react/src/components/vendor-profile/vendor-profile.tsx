// DEPENDENCIES
import React, { useState } from 'react';
import { useDispatch  } from 'react-redux';

// COMPONENTS
import CommentSection from '../comments/comment-section';
import VendorData from './vendor-data';
import { FaTimes } from 'react-icons/fa';

// HOOKS
import useGetVendorData from './hooks/use-get-vendor-data';
import useGetAppState from '../common/hooks/use-get-app-state';

// ACTIONS
import { 
  setIsVendorSelected 
} from '../../redux/actions/ui-actions';


const VendorProfile = (props:any) => {
  const dispatch = useDispatch();

  const state = useGetAppState();

  const isVendorSelected = state.ui.isVendorSelected;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  const hideProfile = () => {
    dispatch(setIsVendorSelected(false));
  }

  return (
    <div className={isVendorSelected ? 'vendorprofile__wrapper' : 'vendorprofile__wrapper_hidden'}>
      <div className='font__vendor_profile_header vendorprofile__topbar_wrapper'>
        { isLoaded ? <h2>{vendor.name}</h2> : <h2>loading...</h2> }
        <div className='vendorprofile__x_wrapper'>
          <FaTimes onClick={hideProfile}/> 
        </div>
      </div>


      <div className='vendorprofile__image_wrapper'>
        <div className='vendorprofile__image'>
          { isLoaded ? 
            <img alt={`${vendor.name} logo`} src={vendor.profileImageLink} /> :
            <h2>loading...</h2>
          }
        </div>
      </div>

      <div className='vendorprofile__categories_wrapper'>
        categories
      </div>
      <div className='vendorprofile__content_wrapper'>

      </div>
    </div>
  );
}

export default VendorProfile;
