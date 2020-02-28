// DEPENDENCIES
import React, { ReactComponentElement } from 'react';

// COMPONENTS
import Map from '../map/map';
import VendorSelectorDesktop from '../vendor-selector/menu-desktop';
import VendorSelectorMobile from '../vendor-selector/menu-mobile';
import RegionNavbar from '../navbar/region-navbar'

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';
import useProcessMapPoints from './hooks/use-process-map-points';
import useUpdateRegionVendorData from './hooks/use-update-region-vendor-data';
import windowSizeEffects from '../common/hooks/use-window-size';

const renderMap = (args:any) => {
  const {isRegionLoaded, areVendorsLoaded, state} = args;

  // Map gets fed data as props instead of reading from redux store so there can be multiple maps rendered at once
  const map = isRegionLoaded && areVendorsLoaded ? 
    <Map mapType='region' mapData={ state.regionMap }/> : 
    <p>loading</p> 

  return map
}

const RegionHome = (props:any) => {
  // Effects
  const state = useGetAppState();
  useLoadRegion(props);
  useUpdateRegionVendorData(); // Set socket listeners
  useProcessMapPoints(props);  // Get all vendors in to the Map Pins on first load

  // Quick variable references
  const isMobile = windowSizeEffects.useIsMobile();
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;
  
  // Custom Map Components
  const Map:ReactComponentElement<any> = renderMap({isRegionLoaded, areVendorsLoaded, state});

  return (
    <div className={ isMobile ? 'region_mobile__wrapper' : 'region__wrapper' }>
      { /* Mobile Responsiveness */ }
      { isMobile ? 
        <RegionNavbar /> :
        <VendorSelectorDesktop/> 
      }
      {/* RIGHT HERE ADD MAP INFO CARD */}
      { Map }
      { isMobile ?
        <VendorSelectorMobile /> :
        null 
      }
    </div>
  );
}

export default RegionHome;
