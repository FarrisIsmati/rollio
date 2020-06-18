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

const Region = (props:any) => {
  // Effects
  useLoadRegion(props);
  useUpdateRegionVendorData(); // Set socket listeners
  useProcessMapPoints(props);  // Get all vendors in to the Map Pins on first load

  const isMobile = useWindowEffects.useIsMobile();

  return (
    <React.Fragment>
        { !isMobile ? 
            <RegionDesktop /> :
            <RegionMobile />
        }
    </React.Fragment>
  );
}

export default Region;
