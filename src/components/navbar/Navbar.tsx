// DEPENDENCIES
import React, { FC, useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';

// HOOKS
import useWindowWidth from '../common/hooks/use-window-width';

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

const Navbar:FC = () => {
  const width = useWindowWidth();

  return (
      // Mobile resize this flex centers
    <div className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div className="navbar__logo_wrapper">
            <img alt="Rollio Logo" src={logo} />
          </div>

          { /* Mobile Responsiveness */ }
          { width > 576 ? NavbarLinks : NavbarHamburger }
        </div>
    </div>
  );
}


export default Navbar;
