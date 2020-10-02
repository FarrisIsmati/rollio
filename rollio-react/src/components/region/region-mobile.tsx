// DEPENDENCIES
import React, { useRef } from 'react';

// COMPONENTS
import Menu from '../menu/menu';
import DashboardMobile from '../dashboard-public/dashboard-mobile';
import Navbar from '../navbar/navbar-mobile';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMainMenu from '../menu/hooks/use-set-main-menu';
import useGetScreenHeightRefDifferenc from '../common/hooks/use-get-screen-height-ref-difference';

const RegionMobile = (props:any) => {
  const { map } = props;

  const state = useGetAppState();

  const showMenu = state.ui.isMainDropDownMenuExpanded

  // Refs
  const navbarRef = useRef();
  const menuRef = useRef();

  useSetMainMenu({menuRef});
  const MenuItem = showMenu ? <Menu ref={menuRef} /> : null

  const regionContentHeight = useGetScreenHeightRefDifferenc(navbarRef) + 'px'; // Gets height of content area minus ref heights

  return (
    <div className='region_mobile'>
      <Navbar ref={navbarRef} />
        <div className='region_mobile__map_wrapper' style={{ height: regionContentHeight }}>
          { MenuItem }
          { map }
        </div>
        
      <DashboardMobile />
    </div>
  );
}

export default RegionMobile;
