// DEPENDENCIES
import React, { ReactComponentElement, useRef } from 'react';

// COMPONENTS
import Menu from '../menu/menu';
// import Map from '../map/map';
import DashboardMobile from '../dashboard/dashboard-mobile';
import Navbar from '../navbar/navbar-mobile';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMainMenu from '../menu/hooks/use-set-main-menu';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';

const RegionMobile = (props:any) => {
  // Effects
  const state = useGetAppState();

  // Variables
  const showMenu = state.ui.isMainDropDownMenuExpanded
  // const isRegionLoaded = state.loadState.isRegionLoaded;
  // const areVendorsLoaded = state.loadState.areVendorsLoaded;

  // Refs
  const navbarRef = useRef();
  const menuRef = useRef();
  useSetMainMenu({menuRef});

  // On Render height sizing
  // Gets height of content area minus ref heights
  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarRef) + 'px';

  return (
    <div className='region_mobile'>
        <React.Fragment>
          <Navbar ref={navbarRef} />
            <div className='region_mobile__map_wrapper' style={{ height: regionContentHeight }}>
              { 
                showMenu ?
                  <Menu ref={menuRef} /> :
                  null
              }
              {/* { isRegionLoaded && areVendorsLoaded ? 
                <div className='map__wrapper'>
                  <Map mapType='region' mapData={ state.regionMap }/>
                </div> : 
                <p>loading</p> 
              } */}
            </div>
          <DashboardMobile />
        </React.Fragment> 
    </div>
  );
}

export default RegionMobile;
