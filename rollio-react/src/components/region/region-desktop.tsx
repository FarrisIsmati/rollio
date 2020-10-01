// DEPENDENCIES
import React, { useRef } from 'react';
  
// COMPONENTS
import DashboardDesktop from '../dashboard-public/dashboard-desktop';
import Navbar from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard-public/dashboard-filterbar';
import VendorProfileDesktopModal from '../vendor-profile/vendor-profile-desktop-modal';
import DashboardGroupSelectDesktopModal from '../dashboard-public/dashboard-group-select-desktop-modal';

// HOOKS
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';
import useGetAppState from '../common/hooks/use-get-app-state';

const RegionDesktop = (props:any) => {
  const { map } = props;

  const state = useGetAppState();

  // Refs
  const navbarDesktopRef = useRef();
  const dashboardFilterBarRef = useRef();

  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarDesktopRef, dashboardFilterBarRef) + 'px'; // Gets height of content area minus ref heights

  return (
    <div className={ 'region_desktop' }>
        <Navbar ref={navbarDesktopRef} {...props} />
        <DashboardFilterBar state={state} ref={dashboardFilterBarRef}/>

        <div className='region__content' style={{ height: regionContentHeight }}>
          <DashboardDesktop regionContentHeight={regionContentHeight} />
          { map }
        </div>
        
        {/* Region Desktop Modals */}
        <VendorProfileDesktopModal />
        <DashboardGroupSelectDesktopModal />
    </div>
  );
}

export default RegionDesktop;
