// DEPENDENCIES
import React from 'react';

// COMPONENTS
import Map from '../map/map';

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';

const RegionHome = (props:any) => {
  // On mount load the region
  useLoadRegion(props);

  const state = useGetAppState();
  const isRegionLoaded = state.async.isRegionLoaded
  const areVendorsLoaded = state.async.areVendorsLoaded

  // Render Content
  const content = isRegionLoaded && areVendorsLoaded ? <Map /> : <p>loading</p>

  return (
    <div className='regionhome__wrapper'>
      { content }
    </div>
  );
}

export default RegionHome;
