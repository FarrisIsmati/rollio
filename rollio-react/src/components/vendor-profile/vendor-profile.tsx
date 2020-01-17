// DEPENDENCIES
import React, { useState } from 'react';

// COMPONENTS
import CommentSection from '../comments/comment-section';
import VendorData from './vendor-data';
import { FaTimes } from 'react-icons/fa';

// HOOKS
import useGetVendorData from './hooks/use-get-vendor-data';
import useGetAppState from '../common/hooks/use-get-app-state';

const VendorProfile = (props:any) => {
  const state = useGetAppState();

  const [vendorProfileClassName, setVendorProfileClassName] = useState('vendorprofile__wrapper')

  const isVendorSelected = state.data.selectedVendor.id !== '';

  const vendor = state.data.selectedVendor;

  const hideProfile = () => {
    setVendorProfileClassName('vendorprofile__wrapper_hidden');
  }

  return (
    <div className={vendorProfileClassName}>
      <div className='font__vendor_profile_header vendorprofile__topbar_wrapper'>
        { isVendorSelected ? 
          <h2>{vendor.name}</h2>:
          <h2>Food Truck</h2>
        }
        <div className='vendorprofile__x_wrapper'>
          <FaTimes onClick={hideProfile}/>
        </div>
      </div>

      { isVendorSelected ? 
        <div className='vendorprofile__image_wrapper'>
          <div className='vendorprofile__image'>
            <img alt={`${vendor.name} logo`} src={vendor.profileImageLink} />
          </div>
        </div> :
        <p>loading</p>
      }

      <div className='vendorprofile__categories_wrapper'>
        categories
      </div>
      <div className='vendorprofile__content_wrapper'>

      </div>
    </div>
  );
}

export default VendorProfile;
