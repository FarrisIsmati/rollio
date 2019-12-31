// DEPENDENCIES
import React, { FC } from 'react';

const RegionNavbarMobile:FC = () => {
  return (
      // Mobile resize this flex centers
    <div className="navbar__wrapper"> 
        <div className="navbar__content_wrapper">
          <div>
            <h1 className="font__navbar">ROLLIO</h1>
          </div>

          <div className="navbar__links_wrapper_mobile">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 12H11V10H7V12ZM0 0V2H18V0H0ZM3 7H15V5H3V7Z" />
            </svg>
          </div>
        </div>
    </div>
  );
}


export default RegionNavbarMobile;
