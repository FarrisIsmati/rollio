// DEPENDENCIES
import React, { useEffect, useState, FC } from 'react';
import { FaChevronUp, FaTimes } from 'react-icons/fa';

// HOOKS
import useWindowSize from '../common/hooks/use-window-size';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const VendorSelectorMobile:FC = () => {
    
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);

    const windowHeight = useWindowSize.useWindowHeight();

    const expandedMenuStyle = {
        // .81 golden ratio number
        height: `${windowHeight * .81}px`,
        transition: 'height .25s',
        'transition-timing-function': 'ease-in'
    }

    const contractedMenuStyle = {
        height: '56px',
        transition: 'height .15s',
        'transition-timing-function': 'ease-out'
    }

    const toggleMenuState = () => {
        setIsMenuExpanded(!isMenuExpanded);
    }

  return (
      // Mobile resize this flex centers
    <div className="menu_mobile__wrapper" style={isMenuExpanded ? expandedMenuStyle : contractedMenuStyle}> 
        <div className="menu_mobile__content_wrapper">
            <div className="menu_mobile__topbar_wrapper">
                <div className="menu_mobile__topbar">
                    <div className="menu_mobile__topbar_text">
                        <h2 className="font__menu_topbar">All Food Trucks</h2>
                        { isMenuExpanded ?  <FaTimes onClick={toggleMenuState} /> : <FaChevronUp onClick={toggleMenuState} /> }
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}


export default VendorSelectorMobile;
