// DEPENDENCIES
import React, { useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import constants from '../../util/constants';

// COMPONENTS
import VendorProfileContent from './vendor-profile-content';
import ReactLoading from 'react-loading';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';
import useMap from '../map/hooks/useMap';

// ACTIONS
import { deselectAllVendors } from '../../redux/actions/data-actions';
import { toggleMobileDashboard, setshowSelectedVendor } from '../../redux/actions/ui-actions';

// UTILS
import {isActive} from "../../util";

const VendorProfileMobile = React.forwardRef((props:any, navbarRef)=> {
    const state = useGetAppState();
    const dispatch = useDispatch();
    const { zoomToLocation } = useMap();

    // Refs
    const mobileHeaderRef:any = useRef();

    // Height of the content minus header
    const vendorProfileContentHeight = useGetScreenHeightRefDifferenc(mobileHeaderRef) + 'px';
    
    const isVendorSelected = state.ui.isVendorSelected;
    const showMobileVendorProfile = isVendorSelected && state.ui.showSelectedVendor && state.ui.isMobileDashboardExpanded;
    const isLoaded = state.loadState.isVendorLoaded;
    const vendor = state.data.selectedVendor;

    return (
        <div className={showMobileVendorProfile ? 'vendorprofile_mobile' : 'vendorprofile_mobile__hidden'}>
            { isLoaded ?
                <React.Fragment>
                <div ref={mobileHeaderRef} className='font__vendor_profile_header vendorprofile_mobile__header_wrapper'>
                    <div className='flex__center'>
                    <i className="material-icons-outlined" onClick={()=>{ dispatch(deselectAllVendors()) }}>arrow_back</i>
                    </div>
                    <div className="vendorprofile_mobile_header">
                    <h2>{vendor.name}</h2>
                    </div>
                    <div className='flex__center'>
                    <i className="material-icons-outlined"
                        onClick={ () => {
                            // If there is a currently selected vendor just toggle the menu
                            if (isActive(vendor)) {
                                dispatch(toggleMobileDashboard());
                                dispatch(setshowSelectedVendor(false));
                            // Else deselect the non active vendor and toggle menu (Because this vendor doesn't need to still be selected once the menu is hidden)
                            } else {
                                dispatch(deselectAllVendors({cb: () => dispatch(toggleMobileDashboard())}))
                            }
                        }
                    } >close</i>
                    </div>
                </div>

                <Scrollbars
                    style={{ width: '100%', height: vendorProfileContentHeight }}
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
                </React.Fragment> : <div className='flex__center_full_height'><ReactLoading type={'spokes'} color={constants.LOADING_COLOR} height={64} width={64} /></div>
            }
        </div>
    );
});

export default VendorProfileMobile;
