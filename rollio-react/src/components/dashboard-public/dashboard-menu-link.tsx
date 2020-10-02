// DEPENDENCIES
import React from 'react';

// HOOKS
import useSelectVendorProfile from '../vendor-profile-public/hooks/use-select-vendor-profile';

// INTERFACES
import { MenuLinkProps } from './interfaces';

const MenuLink = (props:MenuLinkProps) => {
  const { name, id: vendorID, img } = props;
  const selectVendorProfile = useSelectVendorProfile();

  return (
    // Mobile resize this flex centers
    <div onClick={() => { selectVendorProfile(vendorID) }} className="dashboard_link">
      <div className='flex'>
        <div className="dashboard_link__image_wrapper">
            <div className="dashboard_link__image">
              <img alt={`${name} logo`} src={img} />
            </div>
        </div>
        <div className='flex__center'>
          <h2 className="font__dashboard_link">{name}</h2>
        </div>
      </div>
      <div className='flex__center'>
        <i className="material-icons-outlined">keyboard_arrow_right</i> 
      </div>
    </div>
  )
}

export default MenuLink;
