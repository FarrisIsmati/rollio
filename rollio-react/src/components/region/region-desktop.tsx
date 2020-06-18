// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';

// COMPONENTS
import Map from '../map/map';
import DashboardDesktop from '../dashboard/dashboard-desktop';
import Navbar from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard/dashboard-filterbar';
import useWindowEffects from '../common/hooks/use-window-size';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';

const renderMap = (args:any) => {
  const {isRegionLoaded, areVendorsLoaded, mapWidth, state} = args;

  // Map gets fed data as props instead of reading from redux store so there can be multiple maps rendered at once
  const map = isRegionLoaded && areVendorsLoaded ? 
    <div className='map__wrapper' style={{ width: mapWidth }}>
      <Map mapType='region' mapData={ state.regionMap }/>
    </div> : 
    <p>loading</p> 

  return map
}

const RegionDesktop = (props:any) => {
  // Effects
  const state = useGetAppState();
  const isMobile = useWindowEffects.useIsMobile();
  const windowWidth = useWindowEffects.useWindowWidth();

  // Variables
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;

  // Refs
  const navbarDesktopRef = useRef();
  const dashboardFilterBarRef = useRef();

  // Desktop Map Width
  // Screen width minus the fixed dashboard width
  const mapWidth = windowWidth - 788 + 'px';

  // Custom Map Components
  const Map:ReactComponentElement<any> = renderMap({isRegionLoaded, areVendorsLoaded, state, mapWidth});

  // On Render height sizing
  // Gets height of content area minus ref heights
  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarDesktopRef, dashboardFilterBarRef) + 'px';

  return (
    <div className={ 'region_desktop' }>
        <Navbar ref={navbarDesktopRef}/>
        <DashboardFilterBar ref={dashboardFilterBarRef}/>

        <div className='region__content' style={{ height: regionContentHeight }}>
            <DashboardDesktop/>
            { Map }
        </div>
    </div>
  );
}

export default RegionDesktop;
