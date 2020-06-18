// DEPENDENCIES
import React, { FC } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import DashboardLinks from './dashboard-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import TwoOptionSwitch from '../common/other/two-option-switch';

// ACTIONS
import { toggleMobileDashboard } from '../../redux/actions/ui-actions';
import { deSelectVendor } from '../../redux/actions/data-actions';
import { setDashboardVendorsDisplay } from '../../redux/actions/ui-actions';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetDashboardMenuStyle from './hooks/use-set-mobile-dashboard-style';
import useSetMobileMenuHeightOnScroll from './hooks/use-set-mobile-dashboard-height-on-scroll';
import useToggleVendorMenuOnScreenSwitch from './hooks/use-toggle-vendor-dashboard-on-screen-switch';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const DashboardMobile:FC = () => {
    // Hooks
    const state = useGetAppState();
    const dispatch = useDispatch();
    
    // Refs
    const topRef = useCallbackRef(null, () => {});
    
    // Effects
    useToggleVendorMenuOnScreenSwitch();

    const { isDashboardExpanded, expandedDashboardStyle, contractedDashboardStyle} = useSetDashboardMenuStyle();
    // Does vendor profile height size animation based on scroll position
    const { vendorLinksHeight, properHeight } = useSetMobileMenuHeightOnScroll({topRef, expandedDashboardStyle})

    return (
        // Mobile resize this flex centers
        <div className="dashboard_mobile" style={isDashboardExpanded ? {...expandedDashboardStyle, height: properHeight} : contractedDashboardStyle} >
            <VendorProfile ref={topRef}/>
            <div className="dashboard_mobile__content_wrapper">
                <div ref={topRef} className="dashboard_mobile__topbar_wrapper">
                    <div className="dashboard_mobile__topbar">
                        <div className="dashboard_mobile__topbar_text">
                            <h2 className="font__dashboard_topbar">Food Trucks</h2>
                            { isDashboardExpanded ? 
                                <i className="material-icons-outlined" onClick={()=>{dispatch(toggleMobileDashboard())}}>close</i> : 
                                <i className="material-icons-outlined" onClick={()=>{
                                    // If there is a currently selected vendor, deselect it then bring the vendor menu back
                                    if (state.regionMap.currentlySelected.id) {
                                        dispatch(deSelectVendor(() => dispatch(toggleMobileDashboard())));
                                    // Else just bring the vendor menu back
                                    } else {
                                        dispatch(toggleMobileDashboard());
                                    }
                                }}>keyboard_arrow_up</i> 
                            }
                        </div>
                    </div>
                </div>
                <TwoOptionSwitch 
                    onClick={ (opt:string)=>{ dispatch(setDashboardVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
                    vendorTypeName={ 'Trucks' } 
                    isOptionA={ state.ui.dashboardVendorsDisplay === 'all' ? true : false } 
                    font='font__dashboard_switch'
                />
                <DashboardLinks { ...{vendorLinksHeight, refs: [topRef]} } />
            </div>
        </div>
    );
}

export default DashboardMobile;
