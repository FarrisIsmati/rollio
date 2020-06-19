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


const Region = (props:any) => {
  // Effects
  useLoadRegion(props);
  useUpdateRegionVendorData(); // Set socket listeners
  useProcessMapPoints(props);  // Get all vendors in to the Map Pins on first load
  
    // Effects
    const state = useGetAppState();

  // Variables
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;

  const isMobile = useWindowEffects.useIsMobile();

  return (
    <React.Fragment>
                {
            isRegionLoaded && areVendorsLoaded ? 
              <Map mapType='region' mapData={ state.regionMap } /> : 
              <p>loading</p> 
          }
        { !isMobile ? 
            <RegionDesktop /> :
            <RegionMobile />
        }
    </React.Fragment>
  );
}

export default Region;
