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

  // Render Content
  const content = useGetAppState().async.isRegionLoaded ? <Map /> : <p>loading</p>

  return (
    <div className='regionhome__wrapper'>
      { content }
    </div>
  );
}

export default RegionHome;
