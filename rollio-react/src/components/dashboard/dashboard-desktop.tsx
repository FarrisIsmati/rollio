// DEPENDENCIES
import React, { useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import Menu from '../menu/menu';
import DashboardLinks from './dashboard-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import Navbar from '../navbar/region-navbar';
import TwoOptionSwitch from '../common/other/two-option-switch';

// ACTIONS
import { setDashboardVendorsDisplay } from '../../redux/actions/ui-actions';

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMainMenu from '../menu/hooks/use-set-main-menu';

const DashboardDesktop = () => {
  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();

  // Variables
  const showMenu = state.ui.isMainDropDownMenuExpanded

  // Ref (For mobile code is used on region-home.tsx)
  const menuRef = useRef();
  useSetMainMenu({menuRef});

  // Refs (used to get size of elements to set scroll height)
  const navbarRef = useCallbackRef(null, () => {});
  const menuActiveSwtichRef = useCallbackRef(null, () => {});

  const vendorLinksHeight = windowSizeEffects.useWindowHeight() - 26

  return (      
    <div className='region__vendor_dashboard_wrapper'>
      <div className='dashboard__top'>
        {/* Navbar takes navbarRef and sets it the other elements just use it */}
        <Navbar ref={navbarRef}/>
        { 
          showMenu ?
            <Menu ref={menuRef} /> :
            null
        }
        <VendorProfile ref={navbarRef} />
      </div>
      <div className="dashboard__wrapper">
        <TwoOptionSwitch 
          onClick={ (opt:string)=>{ dispatch(setDashboardVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
          vendorTypeName={ 'Trucks' } 
          isOptionA={ state.ui.dashboardVendorsDisplay === 'all' } 
          ref={ menuActiveSwtichRef } 
          font='font__dashboard_switch' 
        />
        <DashboardLinks {...{ vendorLinksHeight, refs: [navbarRef, menuActiveSwtichRef] }}/>
      </div>

    </div>
  );
}

export default DashboardDesktop;
