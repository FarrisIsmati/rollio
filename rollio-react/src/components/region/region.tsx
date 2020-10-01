// DEPENDENCIES
import React from 'react';

// COMPONENTS
import RegionDesktop from './region-desktop'
import RegionMobile from './region-mobile'

// HOOKS
import useWindowEffects from '../common/hooks/use-window-size';
import useLoadRegion from './hooks/use-load-region';
import useProcessMapPoints from './hooks/use-process-map-points';
import useUpdateRegionVendorData from './hooks/use-update-region-vendor-data';
import useGetAppState from '../common/hooks/use-get-app-state';

import Map from '../map/map';

// Load map only if region data & vendors data is loaded
const map = (state:any) => {
    const isRegionLoaded = state.loadState.isRegionLoaded;
    const areVendorsLoaded = state.loadState.areVendorsLoaded;
  
    return isRegionLoaded && areVendorsLoaded ? 
      <Map mapType='region' mapData={ state.regionMap } /> : 
      <p>loading</p>
}

const Region = (props:any) => {
  useLoadRegion(props); // Loads region data from name
  useUpdateRegionVendorData(); // Set socket listeners
  useProcessMapPoints(props);  // Get all vendors in to the Map Pins on first load
  
  const state = useGetAppState();
  const isMobile = useWindowEffects.useIsMobile();

  return (
    <React.Fragment>
        { !isMobile ? 
            <RegionDesktop map={map(state)} {...props}/> :
            <RegionMobile map={map(state)} {...props}/>
        }
    </React.Fragment>
  );
}

export default Region;
