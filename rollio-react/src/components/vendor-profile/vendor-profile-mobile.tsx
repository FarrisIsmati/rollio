// DEPENDENCIES
import React, { useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

// COMPONENTS
import VendorProfileContent from './vendor-profile-content';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useScrollPosition from '../common/hooks/use-scroll-position';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';
import useMap from '../map/hooks/useMap';

// ACTIONS
import { deSelectVendor } from '../../redux/actions/data-actions';
import { toggleMobileDashboard } from '../../redux/actions/ui-actions';

// UTILS
import {isActive} from "../../util";

const VendorProfileMobile = React.forwardRef((props:any, navbarRef)=> {
  // Refs
  const mobileHeaderRef:any = useRef();

  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();
  const { zoomToLocation } = useMap();

  // Height of the content minus ()
  const vendorProfileContentHeight = useGetScreenHeightRefDifferenc(mobileHeaderRef) + 'px';

  const handleScroll = useScrollPosition({
    isLoaded: state.loadState.isVendorLoaded
  });

  // Variables
  const isVendorSelected = state.ui.isVendorSelected;
  const showMobileVendorProfile = isVendorSelected && state.ui.isMobileDashboardExpanded;
  const isLoaded = state.loadState.isVendorLoaded;
  const vendor = state.data.selectedVendor;

  return (
    <div className={showMobileVendorProfile ? 'vendorprofile_mobile__wrapper' : 'vendorprofile_mobile__wrapper_hidden'}>
        { isLoaded ?
            <React.Fragment>
            <div ref={mobileHeaderRef} className='font__vendor_profile_header vendorprofile_mobile__header_wrapper'>
                <div className='flex__center'>
                <i className="material-icons-outlined" onClick={()=>{ dispatch(deSelectVendor()) }}>arrow_back</i>
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
                        dispatch(deSelectVendor(() => dispatch(toggleMobileDashboard())))
                    }
                    }
                } >close</i>
                </div>
            </div>

            <Scrollbars
                style={{ width: '100%', height: vendorProfileContentHeight }}
                onScroll={handleScroll}
                // Hide scrollbar when vendor profile is being animated closed
                renderThumbVertical={
                ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'rgba(0, 0, 0, 0.2)' : 'transparent' }} />
                }
            >
                <VendorProfileContent
                    isMobile={true}
                    findOnMap={(location:any) => {
                        dispatch(toggleMobileDashboard());
                        zoomToLocation(location);
                        }
                    }
                    vendor={vendor}
                    state={state} 
                />
            </Scrollbars>
            </React.Fragment> : <p>loading...</p>
        }
    </div>
  );
});

export default VendorProfileMobile;
