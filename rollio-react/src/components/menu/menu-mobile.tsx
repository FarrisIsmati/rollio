// DEPENDENCIES
import React, { FC } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import MenuLinks from './menu-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import TwoOptionSwitch from '../common/other/two-option-switch';

// ACTIONS
import { toggleMobileMenu } from '../../redux/actions/ui-actions';
import { deSelectVendor } from '../../redux/actions/data-actions';
import { setMenuVendorsDisplay } from '../../redux/actions/ui-actions';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMobileMenuStyle from './hooks/use-set-mobile-menu-style';
import useSetMobileMenuHeightOnScroll from './hooks/use-set-mobile-menu-height-on-scroll';
import useToggleVendorMenuOnScreenSwitch from './hooks/use-toggle-vendor-menu-on-screen-switch';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const MenuMobile:FC = () => {
    // Hooks
    const state = useGetAppState();
    const dispatch = useDispatch();

    // Refs
    const topRef = useCallbackRef(null, () => {});
    
    // Effects
    useToggleVendorMenuOnScreenSwitch();

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
                            <h2 className="font__menu_topbar">Food Trucks</h2>
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
                <TwoOptionSwitch 
                    onClick={ (opt:string)=>{ dispatch(setMenuVendorsDisplay(opt === 'a' ? 'active' : 'all')) } }
                    vendorTypeName={ 'Trucks' } 
                    isOptionA={ state.ui.menuVendorsDisplay === 'all' ? true : false } 
                    font='font__menu_switch'
                />
                <MenuLinks { ...{vendorLinksHeight, refs: [topRef]} } />
            </div>
        </div>
    );
}

export default MenuMobile;
