// DEPENDENCIES
import React, { FC, useEffect, useState, useRef } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorSelectorLinks from './vendor-selector-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import { FaChevronUp, FaTimes } from 'react-icons/fa';

// ACTIONS
import { toggleMobileMenu } from '../../redux/actions/ui-actions';

// HOOKS
import useScrollPosition from './hooks/use-scroll-position';
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMobileMenuStyle from './hooks/use-set-mobile-menu-style';
import windowSizeEffects from '../common/hooks/use-window-size';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const VendorSelectorMobile:FC = () => {
    // Effects
    const dispatch = useDispatch();
    const state = useGetAppState();

    useEffect(() => {
        // Expands or contracts menu pending desktop/mobile state when window changes from desktop/mobile
        if (state.ui.isVendorSelected && !state.ui.isMobileMenuExpanded) {
            console.log('vendor is selected')
            dispatch(toggleMobileMenu())
        }
    }, [state.ui.isVendorSelected]);

    // Quick variable references
    const { isMenuExpanded, expandedMenuStyle, contractedMenuStyle} = useSetMobileMenuStyle();
    const vendorSelectorLinksHeight = windowSizeEffects.useWindowHeight() - windowSizeEffects.useWindowHeight() * .19;

    // Refs
    const componentRef:any = useRef();
    const topbarRef = useCallbackRef(null, () => {});









    // UI Effects
    // Scrolling ~WIP~ https://codesandbox.io/s/use-scroll-position-8nfin?fontsize=14 <- Understand how this works
    // USE THIS TO CHANGE HEIGHT OF THIS DIV (useCase dynamic scrolling on mobile)
    const [scrollHeight, setScrollHeight] = useState(parseInt(expandedMenuStyle.height.substring(0, expandedMenuStyle.height.length - 2)));
    




    
    return (
        // Mobile resize this flex centers
        // height: scrollHeight.toString() + 'px' ...expandedMenuStyle
        <div ref={componentRef} className="menu_mobile__wrapper" style={isMenuExpanded ? {...expandedMenuStyle} : contractedMenuStyle} >
            <VendorProfile />
            <div className="menu_mobile__content_wrapper">
                <div ref={topbarRef} className="menu_mobile__topbar_wrapper">
                    <div className="menu_mobile__topbar">
                        <div className="menu_mobile__topbar_text">
                            <h2 className="font__menu_topbar">All Food Trucks</h2>
                            { isMenuExpanded ?  <FaTimes onClick={()=>{dispatch(toggleMobileMenu())}} /> : <FaChevronUp onClick={()=>{dispatch(toggleMobileMenu())}} /> }
                        </div>
                    </div>
                </div>
                <VendorSelectorLinks ref={topbarRef} {...{vendorSelectorLinksHeight}} />
            </div>
        </div>
    );
}

export default VendorSelectorMobile;
