// DEPENDENCIES
import React, { FC } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';
import { Scrollbars } from 'react-custom-scrollbars';

// COMPONENTS
import VendorProfileMobile from '../vendor-profile-public/vendor-profile-mobile'
import Switch from '../common/other/switch';
import DashboardGroupSelectMenu from './dashboard-group-select-mobile';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useGetVendorLinks from './hooks/use-get-vendors-links';
import useSetDashboardMenuStyle from './hooks/use-set-mobile-dashboard-style';
import useSetMobileMenuHeightOnScroll from './hooks/use-set-mobile-dashboard-height-on-scroll';
import useToggleVendorMenuOnScreenSwitch from './hooks/use-toggle-vendor-dashboard-on-screen-switch';
import useGetHeightDifference from './hooks/use-get-height-difference';

// ACTIONS
import { toggleMobileDashboard } from '../../redux/actions/ui-actions';
import { deselectAllVendors } from '../../redux/actions/data-actions';
import { setDashboardVendorsDisplay } from '../../redux/actions/ui-actions';

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

    const state = useGetAppState();
    const dispatch = useDispatch();

    const links = useGetVendorLinks('link');

    const isVendorSelected = state.ui.isVendorSelected;
    
    // Refs
    const topRef = useCallbackRef(null, () => {});
    
    // Effects
    useToggleVendorMenuOnScreenSwitch();

    const { isDashboardExpanded, expandedDashboardStyle, contractedDashboardStyle} = useSetDashboardMenuStyle();

    const { vendorLinksHeight, dashboardHeightNormal, dashboardHeightGroups } = useSetMobileMenuHeightOnScroll({topRef, expandedDashboardStyle})
    const height = useGetHeightDifference([topRef], vendorLinksHeight);

    // Number of vendors in currently selected group
    let groupVendorsCount = 0;

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

                        <Switch
                            onClick={ (opt:string)=>{ dispatch(setDashboardVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
                            vendorTypeName={ 'Trucks' } 
                            isOptionA={ state.ui.dashboardVendorsDisplay === 'all' ? true : false } 
                            font='font__dashboard_switch'
                            type='flat'
                        />

                        <Scrollbars 
                            className="dashboard_links__wrapper" 
                            style={{ width: '100%', height: height }} 
                            // Hide scrollbar when vendor profile is being animated on
                            renderThumbVertical={            
                                ({ style }:any) => <div style={{ ...style, borderRadius: 'inherit', backgroundColor: isVendorSelected ? 'transparent' : 'rgba(0, 0, 0, 0.2)' }} /> 
                            }
                        >
                            { links }
                        </Scrollbars>
                    </React.Fragment>
                }
            </div>

        </div>
    );
}

export default DashboardMobile;
