// DEPENDENCIES
import React from 'react';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorLinks from './vendor-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import Navbar from '../navbar/region-navbar';
import TwoOptionSwitch from '../common/other/two-option-switch';

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';

const MenuDesktop = () => {
  // Create ref to figure out set size of the menu to allow scrolling
  // Set size of menu will be screen height - (div above menu links)
  // Callback ref runs after component is mounted
  const navbarRef = useCallbackRef(null, () => {});
  const menuActiveSwtichRef = useCallbackRef(null, () => {});

  const vendorLinksHeight = windowSizeEffects.useWindowHeight() - 26

  return (      
    <div className='region__vendor_menu_wrapper'>
      <div>
        {/* Navbar takes navbarRef and sets it the other elements just use it */}
        <Navbar ref={navbarRef}/>
        <VendorProfile ref={navbarRef} />
      </div>
      <div className="menu__wrapper">
        <TwoOptionSwitch onClick={ (opt:string)=>{console.log(opt)} } vendorTypeName={ 'Trucks' } isOptionA={ false } ref={ menuActiveSwtichRef } font='font__menu_switch' />
        <VendorLinks {...{ vendorLinksHeight, refs: [navbarRef, menuActiveSwtichRef] }}/>
      </div>
    </div>
  );
}

export default MenuDesktop;
