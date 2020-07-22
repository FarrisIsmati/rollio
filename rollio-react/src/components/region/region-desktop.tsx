// DEPENDENCIES
import React, { useRef } from 'react';
  
// COMPONENTS
// import Map from '../map/map';
import DashboardDesktop from '../dashboard/dashboard-desktop';
import Navbar from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard/dashboard-filterbar';
import VendorProfileDesktop from '../vendor-profile/vendor-profile-desktop';

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
        <Navbar ref={navbarDesktopRef}/>
        <DashboardFilterBar state={state} ref={dashboardFilterBarRef}/>

        <div className='region__content' style={{ height: regionContentHeight }}>
          <DashboardDesktop regionContentHeight={regionContentHeight} />
          { map }
        </div>

        {/* Vendor Profile is here because it's a modal */}
        <VendorProfileDesktop /> 
    </div>
  );
}

export default RegionDesktop;
