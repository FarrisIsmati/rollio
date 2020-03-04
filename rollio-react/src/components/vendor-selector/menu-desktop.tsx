// DEPENDENCIES
import React from 'react';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorLinks from './vendor-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import Navbar from '../navbar/region-navbar';

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';

const MenuDesktop = () => {
  // Create ref to figure out set size of the menu to allow scrolling
  // Set size of menu will be screen height - (div above menu links)
  // Callback ref runs after component is mounted
  const navbarRef = useCallbackRef(null, () => {});

  const vendorLinksHeight = windowSizeEffects.useWindowHeight() - 26

  return (      
    <div className='region__vendor_menu_wrapper'>
      <div>
        {/* Navbar takes navbarRef and sets it the other elements just use it */}
        <Navbar ref={navbarRef}/>
        <VendorProfile ref={navbarRef} />
      </div>
      <div className="menu__wrapper">
          <VendorLinks ref={navbarRef} {...{ vendorLinksHeight }}/>
      </div>
    </div>
  );
}

export default MenuDesktop;
