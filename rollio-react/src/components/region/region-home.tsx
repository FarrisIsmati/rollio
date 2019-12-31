// DEPENDENCIES
import React, { useEffect } from 'react';

// COMPONENTS
import Map from '../map/map';
import RegionMenuDesktop from './region-menu-desktop';
import RegionMenuMobile from './region-menu-mobile';
import RegionNavbarMobile from './region-navbar-mobile'

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';
import useProcessMapPoints from './hooks/use-process-map-points';
import useUpdateRegionVendorData from './hooks/use-update-region-vendor-data';
import useWindowWidth from '../common/hooks/use-window-width';

const RegionHome = (props:any) => {
  // Gets width to render desktop or tablet/mobile version of region menu
  const width = useWindowWidth();

  // Load the region
  useLoadRegion(props);
  
  // Set socket listeners
  useUpdateRegionVendorData();
  
  const state = useGetAppState();
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;
  
  // Get all vendors in to the Map Pins on first load
  useProcessMapPoints(props);
  
  // Render Content
  // Map gets fed data as props instead of reading from redux store so there can be multiple maps rendered at once
  const map = isRegionLoaded && areVendorsLoaded ? <Map mapType='region' mapData={ state.regionMap }/> : <p>loading</p>
  
  return (
    <div className={ width > 768 ? 'region__wrapper' : 'region_mobile__wrapper' }>
      { /* Mobile Responsiveness */ }
      { width > 768 ? <RegionMenuDesktop /> : <RegionNavbarMobile /> }
      { map }
      { width < 768 ? <RegionMenuMobile /> : null }
    </div>
  );
}

export default RegionHome;
