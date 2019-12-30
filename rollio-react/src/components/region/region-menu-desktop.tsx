// DEPENDENCIES
import React from 'react';

// IMG
import logo from '../../img/logo-rollio-beta.png';

const RegionMenuDesktop = (props:any) => {
  return (
    <div className="region__menu_wrapper">
        <div className="navbar__logo_wrapper">
            <img alt="Rollio Logo" src={logo} />
        </div>
    </div>
  );
}

export default RegionMenuDesktop;
