// DEPENDENCIES
import React from 'react';

// COMPONENTS
import Map from '../map/map';

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useRegionData from './hooks/use-region-data';

const RegionHome = (props:any) => {
  // On mount load the region
  useLoadRegion(props);

  // Redux State interaction
  const { GetRegionLoadStatus } = useRegionData;

  return (
    <div className='regionhome__wrapper'>
        {
          GetRegionLoadStatus() ? <Map /> : <p>loading</p>
        }
    </div>
  );
}

export default RegionHome;
