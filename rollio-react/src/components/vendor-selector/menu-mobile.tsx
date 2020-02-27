// DEPENDENCIES
import React, { FC } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorLinks from './vendor-links';
import VendorProfile from '../vendor-profile/vendor-profile'

// ACTIONS
import { toggleMobileMenu } from '../../redux/actions/ui-actions';
import { deSelectVendor } from '../../redux/actions/data-actions';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMobileMenuStyle from './hooks/use-set-mobile-menu-style';
import useSetMobileMenuHeightOnScroll from './hooks/use-set-mobile-menu-height-on-scroll';
import useToggleVendorMenuOnScreenSwitch from './hooks/use-toggle-vendor-menu-on-screen-switch';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const MenuMobile:FC = () => {
    // Hooks
    const state = useGetAppState();

    // Refs
    const topRef = useCallbackRef(null, () => {});
    
    // Effects
    useToggleVendorMenuOnScreenSwitch();

    const dispatch = useDispatch();
    const { isMenuExpanded, expandedMenuStyle, contractedMenuStyle} = useSetMobileMenuStyle();
    // Does vendor profile height size animation based on scroll position
    const { vendorLinksHeight, scrollPositionCb, properHeight } = useSetMobileMenuHeightOnScroll({topRef, expandedMenuStyle})

    return (
        // Mobile resize this flex centers
        <div className="menu_mobile__wrapper" style={isMenuExpanded ? {...expandedMenuStyle, height: properHeight} : contractedMenuStyle} >
            <VendorProfile scrollPositionCb={scrollPositionCb} ref={topRef}/>
            <div className="menu_mobile__content_wrapper">
                <div ref={topRef} className="menu_mobile__topbar_wrapper">
                    <div className="menu_mobile__topbar">
                        <div className="menu_mobile__topbar_text">
                            <h2 className="font__menu_topbar">All Food Trucks</h2>
                            { isMenuExpanded ? 
                                <i className="material-icons-outlined" onClick={()=>{dispatch(toggleMobileMenu())}}>close</i> : 
                                <i className="material-icons-outlined" onClick={()=>{
                                    // If there is a currently selected vendor, deselect it then bring the vendor menu back
                                    if (state.regionMap.currentlySelected.id) {
                                        dispatch(deSelectVendor(state.data.selectedVendor.id, () => dispatch(toggleMobileMenu())));
                                    // Else just bring the vendor menu back
                                    } else {
                                        dispatch(toggleMobileMenu());
                                    }
                                }}>keyboard_arrow_up</i> 
                            }
                        </div>
                    </div>
                </div>
                <VendorLinks ref={topRef} {...{vendorLinksHeight}} />
            </div>
        </div>
    );
}

export default MenuMobile;
