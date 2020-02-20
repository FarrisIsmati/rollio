// DEPENDENCIES
import React from 'react';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorSelectorLinks from './vendor-selector-links';
import VendorProfile from '../vendor-profile/vendor-profile'

// HOOKS
import windowSizeEffects from '../common/hooks/use-window-size';

const VendorSelectorDesktop = () => {
  // Create ref to figure out set size of the menu to allow scrolling
  // Set size of menu will be screen height - (div above menu links)
  // Callback ref runs after component is mounted
  const ref = useCallbackRef(null, () => {});

  const vendorSelectorLinksHeight = windowSizeEffects.useWindowHeight() - 26

  return (      
    <div className='region__vendor_menu_wrapper'>
      <VendorProfile />
      <div className="menu__wrapper">
          <div className="menu__title_wrapper" ref={ref}>
            <h1 className="font__navbar">ROLLIO</h1>
            <div className="menu__type">
              <h2 className="font__menu_link">Food Trucks</h2>
            </div>
          </div>
          <VendorSelectorLinks ref={ref} {...{vendorSelectorLinksHeight}}/>
      </div>
    </div>
  );
}

export default VendorSelectorDesktop;
