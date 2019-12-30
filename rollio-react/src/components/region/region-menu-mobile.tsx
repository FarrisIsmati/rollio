// DEPENDENCIES
import React, { FC } from 'react';
import { FaBars } from 'react-icons/fa';

// IMG
import logo from '../../img/logo-rollio-beta.png';

const NavbarLinks = (
  <div className="navbar__links_wrapper">
    <h2 className="font__navbar">Truck Map</h2>
    <span></span>
    <h2 className="font__navbar">All Trucks</h2>
  </div>
)

const NavbarHamburger = (
  <div className="navbar__links_wrapper_mobile">
    <FaBars />
  </div>
)

const RegionMenuMobile:FC = () => {
  return (
      // Mobile resize this flex centers
    <div className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div className="navbar__logo_wrapper">
            <img alt="Rollio Logo" src={logo} />
          </div>

          { /* Mobile Responsiveness */ }
          { NavbarHamburger }
        </div>
    </div>
  );
}


export default RegionMenuMobile;
