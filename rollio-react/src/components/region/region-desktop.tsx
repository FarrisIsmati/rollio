// DEPENDENCIES
import React, { useRef } from 'react';

// COMPONENTS
// import Map from '../map/map';
import DashboardDesktop from '../dashboard/dashboard-desktop';
import Navbar from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard/dashboard-filterbar';

// HOOKS
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';
import useGetAppState from '../common/hooks/use-get-app-state';

const RegionDesktop = (props:any) => {
  // Variables
  const { map } = props;

  // Effects
  const state = useGetAppState();

  // Refs
  const navbarDesktopRef = useRef();
  const dashboardFilterBarRef = useRef();

  // On Render height sizing
  // Gets height of content area minus ref heights
  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarDesktopRef, dashboardFilterBarRef) + 'px';

  return (
    <div className={ 'region_desktop' }>
        <Navbar ref={navbarDesktopRef}/>
        <DashboardFilterBar state={state} ref={dashboardFilterBarRef}/>

        <div className='region__content' style={{ height: regionContentHeight }}>
          <DashboardDesktop regionContentHeight={regionContentHeight} />
          { map }
        </div>
    </div>
  );
}

export default RegionDesktop;
