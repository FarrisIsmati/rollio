// DEPENDENCIES
import React, { useRef } from 'react';

// COMPONENTS
// import Map from '../map/map';
import DashboardDesktop from '../dashboard/dashboard-desktop';
import Navbar from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard/dashboard-filterbar';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';

const RegionDesktop = (props:any) => {
  // Effects
  const state = useGetAppState();

  // Variables
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;

  // Refs
  const navbarDesktopRef = useRef();
  const dashboardFilterBarRef = useRef();

  // On Render height sizing
  // Gets height of content area minus ref heights
  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarDesktopRef, dashboardFilterBarRef) + 'px';

  return (
    <div className={ 'region_desktop' }>
        <Navbar ref={navbarDesktopRef}/>
        <DashboardFilterBar ref={dashboardFilterBarRef}/>

        <div className='region__content' style={{ height: regionContentHeight }}>
          <DashboardDesktop/>
          {/* {
            isRegionLoaded && areVendorsLoaded ? 
              <Map mapType='region' mapData={ state.regionMap } /> : 
              <p>loading</p> 
          } */}
        </div>
    </div>
  );
}

export default RegionDesktop;
