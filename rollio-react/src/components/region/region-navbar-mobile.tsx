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
    {/* <FaBars /> */}
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" />
    </svg>
  </div>
)

const RegionNavbarMobile:FC = () => {
  return (
      // Mobile resize this flex centers
    <div className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          { /* Mobile Responsiveness */ }
          { NavbarHamburger }
        </div>
    </div>
  );
}


export default RegionNavbarMobile;
