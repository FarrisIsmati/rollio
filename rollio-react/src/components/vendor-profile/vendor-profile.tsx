// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// COMPONENTS
import Chip from '../common/other/chip';
import VendorProfileContent from './vendor-profile-content';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';
import useScrollPosition from '../common/hooks/use-scroll-position';
import useGetHeight from './hooks/use-get-vendor-profile-height';
import useMap from '../map/hooks/useMap';

// ACTIONS
import { deSelectVendor } from '../../redux/actions/data-actions';
import { toggleMobileDashboard } from '../../redux/actions/ui-actions';

// UTILS
import {isActive} from "../../util";

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

const VendorProfile = React.forwardRef((props:any, navbarRef)=> {
  // Refs
  const mobileHeaderRef:any = useRef();

  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();
  const { zoomToCurrentlySelectedVendor } = useMap();

  // Height of the entire vendor profile (window height - navbarRef height)
  const vendorProfileHeight = useGetHeight(navbarRef) + 'px';

  // Height of the content minus ()
  const vendorProfileContentHeight = useGetHeight(mobileHeaderRef) + 'px';

  const handleScroll = useScrollPosition({
    isLoaded: state.loadState.isVendorLoaded,
    cb: windowSizeEffects.useIsMobile() ? props.scrollPositionCb : ()=>{}
  });

  // Variables
  const isMobile = windowSizeEffects.useIsMobile();
  const isVendorSelected = state.ui.isVendorSelected;
  const showMobileVendorProfile = isVendorSelected && state.ui.isMobileDashboardExpanded;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  // Custom Vendor Profile Components
  const Categories:ReactComponentElement<any>[] = setCategoriesComponent({isLoaded, vendor});

  // Difference between the Desktop and Mobile version is how it scrolls the content
  return (
    <React.Fragment>
      { !isMobile ?
        // Desktop version
        <div className={isVendorSelected ? 'vendorprofile__wrapper' : 'vendorprofile__wrapper_hidden'}>
          <Scrollbars
            style={{ width: isMobile ? '100%': '432px', height: vendorProfileHeight }}
            onScroll={handleScroll}
            // Hide scrollbar when vendor profile is being animated closed
            renderThumbVertical={
              ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} />
            }
          >
            { isLoaded ?
              <VendorProfileContent
                isMobile={isMobile}
                closeVendor={() => dispatch(deSelectVendor(vendor.id))}
                findOnMap={() => { zoomToCurrentlySelectedVendor() }}
                vendor={vendor}
                Categories={Categories}
                state={state} /> :
              <p>loading...</p>}
          </Scrollbars>
        </div>
      :
      // Mobile version
      <div className={showMobileVendorProfile ? 'vendorprofile_mobile__wrapper' : 'vendorprofile_mobile__wrapper_hidden'}>
        { isLoaded ?
          <React.Fragment>
            <div ref={mobileHeaderRef} className='font__vendor_profile_header vendorprofile_mobile__header_wrapper'>
              <div className='flex__center'>
                <i className="material-icons-outlined" onClick={()=>{ dispatch(deSelectVendor(vendor.id)) }}>arrow_back</i>
              </div>
              <div className="vendorprofile_mobile_header">
                <h2>{vendor.name}</h2>
              </div>
              <div className='flex__center'>
                <i className="material-icons-outlined"
                  onClick={ () => {
                    // If there is a currently selected vendor just toggle the menu
                    if (isActive(vendor)) {
                        dispatch(toggleMobileDashboard())
                    // Else deselect the non active vendor and toggle menu (Because this vendor doesn't need to still be selected once the menu is hidden)
                    } else {
                      dispatch(deSelectVendor(vendor.id, () => dispatch(toggleMobileDashboard())))
                    }
                  }
                } >close</i>
              </div>
            </div>

            <Scrollbars
              style={{ width: isMobile ? '100%': '432px', height: vendorProfileContentHeight }}
              onScroll={handleScroll}
              // Hide scrollbar when vendor profile is being animated closed
              renderThumbVertical={
                ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} />
              }
            >
              <VendorProfileContent
                isMobile={isMobile}
                findOnMap={() => {
                    dispatch(toggleMobileDashboard());
                    zoomToCurrentlySelectedVendor();
                  }
                }
                vendor={vendor}
                Categories={Categories}
                state={state} />
            </Scrollbars>
          </React.Fragment> : <p>loading...</p>
        }
      </div>
      }
    </React.Fragment>
  );
});

export default VendorProfile;
