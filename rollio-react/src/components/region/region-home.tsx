// DEPENDENCIES
import React from 'react';

// COMPONENTS
import Map from '../map/map';

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';
import useProcessMapPoints from './hooks/use-process-map-points';

const RegionHome = (props:any) => {
  // On mount load the region
  useLoadRegion(props);

  const state = useGetAppState();
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;

  // Get all vendors in to the Map Pins on first load
  useProcessMapPoints(props);

  // Render Content
  // Map gets fed data as props instead of reading from redux store so there can be multiple maps rendered at once
  const map = isRegionLoaded && areVendorsLoaded ? <Map mapType='region' mapData={ state.regionMap } /> : <p>loading</p>

  return (
    <div className='regionhome__wrapper'>
      { map }
    </div>
  );
}

export default RegionHome;
