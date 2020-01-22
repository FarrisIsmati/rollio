// DEPENDENCIES
import React, { ReactComponentElement } from 'react';
import { useDispatch  } from 'react-redux';

// COMPONENTS
import { FaTimes, FaMapMarkerAlt, FaLink, FaPhone, FaTruck, FaCreditCard } from 'react-icons/fa';
import Chip from '../common/other/chip';

// HOOKS
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

  // Render Categories
  let Categories:ReactComponentElement<any>[] = [];
  
  if (isLoaded) {
    Categories = vendor.categories.map((category:string) => {
      return <Chip key={category} text={category} />
    })
    if (vendor.price) {
      Categories.unshift(<Chip key={vendor.price} text={vendor.price}/>)
    }
  }

  return (
    <div className={isVendorSelected ? 'vendorprofile__wrapper' : 'vendorprofile__wrapper_hidden'}>
      { isLoaded ? 
      <React.Fragment>
        <div className='font__vendor_profile_header vendorprofile__topbar_wrapper'>
          <h2>{vendor.name}</h2>
          <div className='vendorprofile__x_wrapper'>
            <FaTimes onClick={hideProfile}/> 
          </div>
        </div>


        <div className='vendorprofile__image_wrapper'>
          <div className='vendorprofile__image'>
            <img alt={`${vendor.name} logo`} src={vendor.profileImageLink} /> 
          </div>
        </div>

        <div className='vendorprofile__categories_wrapper'>
          { Categories }
        </div>

        <div className='vendorprofile__info_wrapper'>
          <div className='vendorprofile__info_row'>
            <div className='vendorprofile__info_icon_wrapper'>
              <FaMapMarkerAlt /> 
            </div>
            <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
              <h2>FIND ON MAP</h2>
            </div>
          </div>

          <div className='vendorprofile__info_row'>
            <div className='vendorprofile__info_icon_wrapper'>
              <FaLink /> 
            </div>
            <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
              { vendor.website ? <h2><a target='_blank' href={vendor.website}>WEBSITE</a></h2> : <h2>WEBSITE UNAVAILABLE</h2> }
            </div>
          </div>

          <div className='vendorprofile__info_row'>
            <div className='vendorprofile__info_icon_wrapper'>
              <FaPhone /> 
            </div>
            <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
              { vendor.phoneNumber ? <h2><a href={`tel:${vendor.phoneNumber}`}>{vendor.phoneNumber}</a></h2> : <h2>PHONE UNAVAILABLE</h2> }
            </div>
          </div>

          
          <div className='vendorprofile__info_row'>
            <div className='vendorprofile__info_icon_wrapper'>
              <FaTruck /> 
            </div>
            <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
              <h2>ABOUT</h2>
            </div>
          </div>

          <div className='vendorprofile__info_row'>
            <div className='vendorprofile__info_icon_wrapper_alt'>
              <FaCreditCard /> 
            </div>
            <div className='vendorprofile__info_text_wrapper font__vendor_profile_info_alt'>
              { vendor.creditCard === 'y' ? <h2>Accepts Credit Cards</h2> : <h2>Doesn't Accept Credit Card</h2>}
            </div>
          </div>

        </div>
      </React.Fragment> : <p>loading...</p>}
    </div>
  );
}

export default VendorProfile;
