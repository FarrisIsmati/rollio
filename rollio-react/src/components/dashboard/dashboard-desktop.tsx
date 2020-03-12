// DEPENDENCIES
import React from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import DashboardLinks from './dashboard-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import Navbar from '../navbar/region-navbar';
import TwoOptionSwitch from '../common/other/two-option-switch';

// ACTIONS
import { setDashboardVendorsDisplay } from '../../redux/actions/ui-actions';

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';
import useGetAppState from '../common/hooks/use-get-app-state';

const DashboardDesktop = () => {
  // Hooks
  const dispatch = useDispatch();
  const state = useGetAppState();

  // Create ref to figure out set size of the menu to allow scrolling
  // Set size of menu will be screen height - (div above menu links)
  // Callback ref runs after component is mounted
  const navbarRef = useCallbackRef(null, () => {});
  const menuActiveSwtichRef = useCallbackRef(null, () => {});

  const vendorLinksHeight = windowSizeEffects.useWindowHeight() - 26

  return (      
    <div className='region__vendor_dashboard_wrapper'>
      <div>
        {/* Navbar takes navbarRef and sets it the other elements just use it */}
        <Navbar ref={navbarRef}/>
        <div className='dashboard__dropdown'>LOOOOL</div>
        <VendorProfile ref={navbarRef} />
      </div>
      <div className="dashboard__wrapper">
        <TwoOptionSwitch 
          onClick={ (opt:string)=>{ dispatch(setDashboardVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
          vendorTypeName={ 'Trucks' } 
          isOptionA={ state.ui.menuVendorsDisplay === 'all' ? true : false } 
          ref={ menuActiveSwtichRef } 
          font='font__dashboard_switch' 
        />
        <DashboardLinks {...{ vendorLinksHeight, refs: [navbarRef, menuActiveSwtichRef] }}/>
      </div>

    </div>
  );
}

export default DashboardDesktop;
