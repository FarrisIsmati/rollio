// DEPENDENCIES
import React from 'react';

// COMPONENTS
import Map from '../map/map';
import VendorSelectorDesktop from '../vendor-selector/vendor-selector-desktop';
import VendorSelectorMobile from '../vendor-selector/vendor-selector-mobile';
import RegionNavbarMobile from './region-navbar-mobile'

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';
import useProcessMapPoints from './hooks/use-process-map-points';
import useUpdateRegionVendorData from './hooks/use-update-region-vendor-data';
import windowSizeEffects from '../common/hooks/use-window-size';

const RegionHome = (props:any) => {
  // Gets width to render desktop or tablet/mobile version of region menu
  const isMobile = windowSizeEffects.useIsMobile();

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
    <div className={ isMobile ? 'region_mobile__wrapper' : 'region__wrapper' }>
      { /* Mobile Responsiveness */ }
      { isMobile ? 
        <RegionNavbarMobile /> :
        <VendorSelectorDesktop/> 
      }
      { map }
      { isMobile ?
        <VendorSelectorMobile /> :
        null 
      }
    </div>
  );
}

export default RegionHome;
