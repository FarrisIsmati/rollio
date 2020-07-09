// DEPENDENCIES
import React from 'react';

// COMPONENTS
import VendorProfileCategories from '../vendor-profile/vendor-profile-categories';

// INTERFACES
import { DashboardCardProps } from './interfaces';

// HOOKS
import useSelectVendorProfile from '../vendor-profile/hooks/use-select-vendor-profile';

const DashboardCard = (props:DashboardCardProps) => {
  const { vendor, img } = props;
  const selectVendorProfile = useSelectVendorProfile();

  return (
    // Mobile resize this flex centers
    // onClick={() => { selectVendorProfile(vendor.id) }}
    <div  className="dashboard__card">
      <div className="dashboard__card_image_wrapper">
          <div className="dashboard__card_image">
            <img alt={`${vendor.name} logo`} src={img} />
          </div>
      </div>
      <div className='dashboard__card_image_wrapper'>

      </div>
      <div className='dashboard__card_title'>
        <h2 className="font__dashboard_card_title">{vendor.name}</h2>
      </div>
      <div className='dashboard__card_categories'>
        < VendorProfileCategories vendor={vendor} limit={2}/>
      </div>
      {/* <div className='flex__center'>
        <i className="material-icons-outlined">keyboard_arrow_right</i> 
      </div> */}
    </div>
  )
}

export default DashboardCard;
