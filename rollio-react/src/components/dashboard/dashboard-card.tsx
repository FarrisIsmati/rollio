// DEPENDENCIES
import React from 'react';

// INTERFACES
import { MenuLinkProps } from './interfaces';

// HOOKS
import useSelectVendorProfile from '../vendor-profile/hooks/use-select-vendor-profile';

const DashboardCard = (props:MenuLinkProps) => {
  const { name, id: vendorID, img } = props;
  const selectVendorProfile = useSelectVendorProfile();

  return (
    // Mobile resize this flex centers
    // onClick={() => { selectVendorProfile(vendorID) }}
    <div  className="dashboard__card">
      <div className="dashboard__card_image_wrapper">
          <div className="dashboard__card_image">
            <img alt={`${name} logo`} src={img} />
          </div>
      </div>
        {/* <div className='flex__center'>
          <h2 className="font__dashboard_link">{name}</h2>
        </div> */}
      {/* <div className='flex__center'>
        <i className="material-icons-outlined">keyboard_arrow_right</i> 
      </div> */}
    </div>
  )
}

export default DashboardCard;
