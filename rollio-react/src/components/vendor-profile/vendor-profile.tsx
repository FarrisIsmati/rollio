// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// COMPONENTS
import Comments from '../comments/comment-section';
import Chip from '../common/other/chip';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';
import useScrollPosition from '../common/hooks/use-scroll-position';
import useGetVendorProfileContentHeight from './hooks/use-get-vendor-profile-content-height';

// ACTIONS
import { 
  deSelectVendor 
} from '../../redux/actions/data-actions';

// Returns an array of categories
const setCategoriesComponent = (args:any) => {
  const {isLoaded, vendor} = args;

  let Categories:ReactComponentElement<any>[] = [];

  if (isLoaded) {
    Categories = vendor.categories.map((category:string) => {
      return <Chip key={category} text={category} />
    })
    if (vendor.price) {
      Categories.unshift(<Chip key={vendor.price} text={vendor.price}/>)
    }
  }

  return Categories;
}

const VendorProfile = (props:any) => {
  // Refs
  const profileTopBarRef:any = useRef();

  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();
  const vendorProfileHeight = useGetVendorProfileContentHeight(profileTopBarRef) + 'px';
  const handleScroll = useScrollPosition({
    isLoaded: state.loadState.isVendorLoaded, 
    cb: windowSizeEffects.useIsMobile() ? props.scrollPositionCb : ()=>{}
  });

  // Quick variable references
  const isMobile = windowSizeEffects.useIsMobile();
  const isVendorSelected = state.ui.isVendorSelected;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  // Custom Vendor Profile Components
  const Categories:ReactComponentElement<any>[] = setCategoriesComponent({isLoaded, vendor});
  
  // Variant Styles
  const vendorProfileClassType = isMobile ? 'vendorprofile_mobile' : 'vendorprofile'

  return (
    <div className={isVendorSelected ? `${vendorProfileClassType}__wrapper` : `${vendorProfileClassType}__wrapper_hidden`}>
      { isLoaded ? 
      <React.Fragment>
        <div ref={profileTopBarRef} className='font__vendor_profile_header vendorprofile__topbar_wrapper'>
          <h2>{vendor.name}</h2>
          <div className='vendorprofile__x_wrapper'>
            <i className="material-icons-outlined" onClick={()=>{dispatch(deSelectVendor(vendor.id))}}>close</i>
          </div>
        </div>

        <Scrollbars 
          style={{ width: isMobile ? '100%': '432px', height: vendorProfileHeight }} 
          onScroll={handleScroll}
          // Hide scrollbar when vendor profile is being animated closed
          renderThumbVertical={            
            ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} /> 
          }
        >
          <div className='vendorprofile__image_wrapper'>
            <div className='vendorprofile__image'>
              <img alt={`${vendor.name} logo`} src={vendor.bannerImageLink} /> 
            </div>
          </div>

          <div className='vendorprofile__categories_wrapper'>
            { Categories }
          </div>

          <div className='vendorprofile__info_wrapper'>
            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper'>
                <i className="material-icons-outlined">room</i> 
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
                <h2>FIND ON MAP</h2>
              </div>
            </div>

            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper'>
                <i className="material-icons-outlined">web</i> 
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
                { vendor.website ? <h2><a target='_blank' href={vendor.website}>WEBSITE</a></h2> : <h2>WEBSITE UNAVAILABLE</h2> }
              </div>
            </div>

            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper'>
                <i className="material-icons-outlined">local_phone</i> 
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
                { vendor.phoneNumber ? <h2><a href={`tel:${vendor.phoneNumber}`}>{vendor.phoneNumber}</a></h2> : <h2>PHONE UNAVAILABLE</h2> }
              </div>
            </div>

            
            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper'>
                <i className="material-icons-outlined">local_shipping</i> 
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info'>
                <h2>ABOUT</h2>
              </div>
            </div>

            <div className='vendorprofile__info_row'>
              <div className='vendorprofile__info_icon_wrapper_alt'>
                <i className="material-icons-outlined">credit_card</i> 
              </div>
              <div className='vendorprofile__info_text_wrapper font__vendor_profile_info_alt'>
                { vendor.creditCard === 'y' ? <h2>Accepts Credit Cards</h2> : <h2>Doesn't Accept Credit Card</h2>}
              </div>
            </div>

            <div className='linebreak'></div>

            <div className='vendorprofile__comments_wrapper'>
              <h2 className='vendorprofile__comments_header font__vendor_profile_header_alt'>Comments</h2>
              <Comments comments={state.data.selectedVendor.comments}/>
            </div>
          </div>
        </Scrollbars> 
      </React.Fragment> : <p>loading...</p>}
    </div>
  );
}

export default VendorProfile;
