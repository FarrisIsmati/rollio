// DEPENDENCIES
import React, { FC } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import DashboardLinks from './dashboard-menu-links';
import VendorProfileMobile from '../vendor-profile/vendor-profile-mobile'
import TwoOptionSwitch from '../common/other/two-option-switch';
import DashboardGroupSelectMenu from './dashboard-group-select-mobile';

// ACTIONS
import { toggleMobileDashboard } from '../../redux/actions/ui-actions';
import { deselectAllVendors } from '../../redux/actions/data-actions';
import { setDashboardVendorsDisplay } from '../../redux/actions/ui-actions';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetDashboardMenuStyle from './hooks/use-set-mobile-dashboard-style';
import useSetMobileMenuHeightOnScroll from './hooks/use-set-mobile-dashboard-height-on-scroll';
import useToggleVendorMenuOnScreenSwitch from './hooks/use-toggle-vendor-dashboard-on-screen-switch';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

// Components
const createDashboardTopBar = (props: any) => {
    const {state, topRef, dispatch, isDashboardExpanded, title} = props;
    return <div ref={topRef} className="dashboard_mobile__topbar_wrapper">
    <div className="dashboard_mobile__topbar">
        <div className="dashboard_mobile__topbar_text">
            <h2 className="font__dashboard_mobile_topbar">{title}</h2>
            { isDashboardExpanded ? 
                <i className="material-icons-outlined" onClick={()=>{dispatch(toggleMobileDashboard())}}>close</i> : 
                <i className="material-icons-outlined" onClick={()=>{
                    // If there is a currently selected vendor, deselect it then bring the vendor menu back
                    if (state.regionMap.currentlySelected.id) {
                        dispatch(
                            deselectAllVendors({cb:() => dispatch(toggleMobileDashboard())}));
                    // Else just bring the vendor menu back
                    } else {
                        dispatch(toggleMobileDashboard());
                    }
                }}>keyboard_arrow_up</i> 
            }
        </div>
    </div>
</div>
}

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
    const { vendorLinksHeight, dashboardHeightNormal, dashboardHeightGroups } = useSetMobileMenuHeightOnScroll({topRef, expandedDashboardStyle})

    let groupVendorsCount = 0;
    // Number of vendors in currently selected group
    if (state.regionMap.temporarilySelected) {
        groupVendorsCount = state.regionMap.vendorsDisplayedGroup[state.regionMap.temporarilySelected].vendors.length;
    }


    return (
        // Mobile resize this flex centers
        <div className="dashboard_mobile" style={isDashboardExpanded ? {...expandedDashboardStyle, height: state.ui.isGroupSelectMenuActive ? dashboardHeightGroups : dashboardHeightNormal} : contractedDashboardStyle} >

            <VendorProfileMobile ref={topRef}/>

            <div className="dashboard_mobile__content_wrapper">
                { state.ui.isGroupSelectMenuActive ? 
                    <React.Fragment>
                        { createDashboardTopBar({state, topRef, dispatch, isDashboardExpanded, title: `${groupVendorsCount  } Trucks`}) }
                        <DashboardGroupSelectMenu { ...{vendorLinksHeight, refs: [topRef]} } />
                    </React.Fragment>
                     :
                    <React.Fragment>
                        { createDashboardTopBar({state, topRef, dispatch, isDashboardExpanded, title: 'Food Trucks'}) }

                        <TwoOptionSwitch
                            onClick={ (opt:string)=>{ dispatch(setDashboardVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
                            vendorTypeName={ 'Trucks' } 
                            isOptionA={ state.ui.dashboardVendorsDisplay === 'all' ? true : false } 
                            font='font__dashboard_switch'
                        />

                        <DashboardLinks { ...{vendorLinksHeight, refs: [topRef]} } />
                    </React.Fragment>
                }
            </div>

        </div>
    );
}

export default DashboardMobile;
// FIGURE OUT PROFILE IMAGE LAYER ISSUE