// DEPENDENCIES
import React, { ReactComponentElement } from 'react';

// COMPONENTS
import Menu from '../menu/menu';
import Map from '../map/map';
import DashboardDesktop from '../dashboard/dashboard-desktop';
import DashboardMobile from '../dashboard/dashboard-mobile';
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

  // Variables
  const showMenu = state.ui.isMainDropDownMenuExpanded
  const isMobile = windowSizeEffects.useIsMobile();
  const isRegionLoaded = state.loadState.isRegionLoaded;
  const areVendorsLoaded = state.loadState.areVendorsLoaded;
  
  // Custom Map Components
  const Map:ReactComponentElement<any> = renderMap({isRegionLoaded, areVendorsLoaded, state});

  return (
    <div className={ isMobile ? 'region_mobile__wrapper' : 'region__wrapper' }>
      { isMobile ?
        <React.Fragment>
          <RegionNavbar />
            <div className='region_mobile__map_wrapper'>
              { 
                showMenu ?
                  <Menu /> :
                  null
              }
              { Map }
            </div>
          <DashboardMobile />
        </React.Fragment> :
        <React.Fragment>
          <DashboardDesktop/> 
          { Map }
        </React.Fragment>
      }
    </div>
  );
}

export default RegionHome;
