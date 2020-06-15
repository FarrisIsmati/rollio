// DEPENDENCIES
import React from 'react';

// INTERFACES
import { MenuLinkProps } from './interfaces';

// HOOKS
import useSelectVendorProfile from '../vendor-profile/hooks/use-select-vendor-profile';

const MenuLink = (props:MenuLinkProps) => {
  const { name, id: vendorID, img } = props;
  const selectVendorProfile = useSelectVendorProfile();

  return (
    // Mobile resize this flex centers
    <div onClick={() => { selectVendorProfile(vendorID) }} className="dashboard_link__wrapper"> 
      <div className="dashboard_link__image_wrapper">
          <div className="dashboard_link__image">
            <img alt={`${name} logo`} src={img} />
          </div>
      </div>
      <div>
        <h2 className="font__dashboard_link">{name}</h2>
      </div>
    </div>
  )
}

export default MenuLink;
