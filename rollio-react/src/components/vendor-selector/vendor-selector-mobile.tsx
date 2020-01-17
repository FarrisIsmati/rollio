// DEPENDENCIES
import React, { FC } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorSelectorLinks from './vendor-selector-links';
import { FaChevronUp, FaTimes } from 'react-icons/fa';

// ACTIONS
import { toggleMobileMenu } from '../../redux/actions/ui-actions';

// HOOKS
import useSetMobileMenuStyle from './hooks/use-set-mobile-menu-style';
import windowSizeEffects from '../common/hooks/use-window-size';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const VendorSelectorMobile:FC = () => {
    const dispatch = useDispatch();
    
    const toggleMenuState = () => {
        dispatch(toggleMobileMenu())
    }

    const ref = useCallbackRef(null, () => {});

    const { isMenuExpanded, expandedMenuStyle, contractedMenuStyle} = useSetMobileMenuStyle();
    const vendorSelectorLinksHeight = windowSizeEffects.useWindowHeight() - windowSizeEffects.useWindowHeight() * .19;

    return (
        // Mobile resize this flex centers
        <div className="menu_mobile__wrapper" style={isMenuExpanded ? expandedMenuStyle : contractedMenuStyle}> 
            <div className="menu_mobile__content_wrapper">
                <div ref={ref} className="menu_mobile__topbar_wrapper">
                    <div className="menu_mobile__topbar">
                        <div className="menu_mobile__topbar_text">
                            <h2 className="font__menu_topbar">All Food Trucks</h2>
                            { isMenuExpanded ?  <FaTimes onClick={toggleMenuState} /> : <FaChevronUp onClick={toggleMenuState} /> }
                        </div>
                    </div>
                </div>
                <VendorSelectorLinks ref={ref} {...{vendorSelectorLinksHeight}} />
            </div>
        </div>
    );
}

export default VendorSelectorMobile;
