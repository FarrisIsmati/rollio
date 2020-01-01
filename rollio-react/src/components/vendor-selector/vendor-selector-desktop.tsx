// DEPENDENCIES
import React, {FC} from 'react';

// COMPONENTS
import VendorSelectorLinks from './vendor-selector-links';

const VendorSelectorDesktop:FC = () => {
  return (
    <div className="menu__wrapper">
        <div>
          <h1 className="font__navbar">ROLLIO</h1>
        </div>
        <VendorSelectorLinks />
    </div>
  );
}

export default VendorSelectorDesktop;
