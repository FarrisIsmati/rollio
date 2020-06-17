// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';

// COMPONENTS
import Map from '../map/map';
import Dashboard from '../dashboard/dashboard-desktop';
import Navbar from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard/dashboard-filterbar';

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';
import useProcessMapPoints from './hooks/use-process-map-points';
import useUpdateRegionVendorData from './hooks/use-update-region-vendor-data';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';

const renderMap = (args:any) => {
  const {isRegionLoaded, areVendorsLoaded, state} = args;

  // Map gets fed data as props instead of reading from redux store so there can be multiple maps rendered at once
  const map = isRegionLoaded && areVendorsLoaded ? 
    <Map mapType='region' mapData={ state.regionMap }/> : 
    <p>loading</p> 

  return map
}

const RegionDesktop = (props:any) => {
  // Effects
  const state = useGetAppState();
  useLoadRegion(props);
  useUpdateRegionVendorData(); // Set socket listeners
  useProcessMapPoints(props);  // Get all vendors in to the Map Pins on first load

  // Variables
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;

  // Refs
  const navbarDesktopRef = useRef();
  const dashboardFilterBarRef = useRef();

  // Custom Map Components
  const Map:ReactComponentElement<any> = renderMap({isRegionLoaded, areVendorsLoaded, state});

  // On Render height sizing
  // Gets height of content area minus ref heights
  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarDesktopRef, dashboardFilterBarRef) + 'px';

  return (
    <div className={ 'region_desktop' }>
        <Navbar ref={navbarDesktopRef}/>
        <DashboardFilterBar ref={dashboardFilterBarRef}/>

        <div className='region__content' style={{ height: regionContentHeight }}>
            <Dashboard/>
            { Map }
        </div>
    </div>
  );
}

export default RegionDesktop;
