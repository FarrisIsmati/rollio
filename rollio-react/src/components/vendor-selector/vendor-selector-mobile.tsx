// DEPENDENCIES
import React, { FC } from 'react';
import { FaChevronUp } from 'react-icons/fa';

const VendorSelectorMobile:FC = () => {
  return (
      // Mobile resize this flex centers
    <div className="menu_mobile__wrapper"> 
        <div className="menu_mobile__content_wrapper">
            <div className="menu_mobile__topbar">
                <div className="menu_mobile__topbar_text">
                    <h2 className="font__menu_topbar">All Food Trucks</h2>
                    <FaChevronUp />
                </div>
            </div>
        </div>
    </div>
  );
}


export default VendorSelectorMobile;
