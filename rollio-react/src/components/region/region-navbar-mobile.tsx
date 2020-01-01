// DEPENDENCIES
import React, { FC } from 'react';
import { FaBars } from 'react-icons/fa';

const RegionNavbarMobile:FC = () => {
  return (
      // Mobile resize this flex centers
    <div className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          <div className="navbar__links_wrapper_mobile">
            <FaBars />
          </div>
        </div>
    </div>
  );
}


export default RegionNavbarMobile;
