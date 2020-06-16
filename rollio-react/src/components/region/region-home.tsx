// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';

// COMPONENTS
import Menu from '../menu/menu';
import Map from '../map/map';
import DashboardDesktop from '../dashboard/dashboard-desktop';
import DashboardMobile from '../dashboard/dashboard-mobile';
import RegionNavbar from '../navbar/region-navbar';
import NavbarDesktop from '../navbar/navbar-desktop';
import DashboardFilterBar from '../dashboard/dashboard-filterbar';

// HOOKS
import useLoadRegion from './hooks/use-load-region';
import useGetAppState from '../common/hooks/use-get-app-state';
import useProcessMapPoints from './hooks/use-process-map-points';
import useUpdateRegionVendorData from './hooks/use-update-region-vendor-data';
import windowSizeEffects from '../common/hooks/use-window-size';
import useSetMainMenu from '../menu/hooks/use-set-main-menu';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';

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

  // Refs Used for Desktop
  const navbarRef = useRef();
  const dashboardFilterBarRef = useRef();


  // Refs Used for Mobile
  const menuRef = useRef();
  useSetMainMenu({menuRef});
    
  // Custom Map Components
  const Map:ReactComponentElement<any> = renderMap({isRegionLoaded, areVendorsLoaded, state});

  // On Render height sizing
  const regionContentWrapperHeight = useGetScreenHeightRefDifferenc(navbarRef, dashboardFilterBarRef) + 'px';

  return (
    <div className={ isMobile ? 'region_mobile__wrapper' : 'region__wrapper' }>
      { isMobile ?
        <React.Fragment>
          <RegionNavbar />
            <div className='region_mobile__map_wrapper'>
              { 
                showMenu ?
                  <Menu ref={menuRef} /> :
                  null
              }
              { Map }
            </div>
          <DashboardMobile />
        </React.Fragment> :
        <div className='region__wrapper'>
          <NavbarDesktop ref={navbarRef}/>
          <DashboardFilterBar ref={dashboardFilterBarRef}/>
          <div className='region__content_wrapper' style={{ height: regionContentWrapperHeight }}>
            <DashboardDesktop/>
            { Map }
          </div>
        </div>
      }
    </div>
  );
}

export default RegionHome;
