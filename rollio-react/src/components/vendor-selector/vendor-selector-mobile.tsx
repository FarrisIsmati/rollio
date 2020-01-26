// DEPENDENCIES
import React, { FC, useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch  } from 'react-redux';
import { useCallbackRef } from 'use-callback-ref';

// COMPONENTS
import VendorSelectorLinks from './vendor-selector-links';
import VendorProfile from '../vendor-profile/vendor-profile'
import { FaChevronUp, FaTimes } from 'react-icons/fa';

// ACTIONS
import { toggleMobileMenu } from '../../redux/actions/ui-actions';

// HOOKS
import useGetAppState from '../common/hooks/use-get-app-state';
import useSetMobileMenuStyle from './hooks/use-set-mobile-menu-style';
import windowSizeEffects from '../common/hooks/use-window-size';

// TO DO: ONCE NAVBAR IS SET PERMANATLEY THEN SET HEIGHT TO A PERCENTAGE OF WIDNOWHEIGHT - NAVBAR HEIGHT

const VendorSelectorMobile:FC = () => {
    // Refs
    const componentRef:any = useRef();
    const topbarRef = useCallbackRef(null, () => {});
    
    // Effects
    const dispatch = useDispatch();
    const state = useGetAppState();

    useEffect(() => {
        // Expands or contracts menu pending desktop/mobile state when window changes from desktop/mobile
        if (state.ui.isVendorSelected && !state.ui.isMobileMenuExpanded) {
            dispatch(toggleMobileMenu())
        }
    }, [state.ui.isVendorSelected]);

    // Quick variable references
    const { isMenuExpanded, expandedMenuStyle, contractedMenuStyle} = useSetMobileMenuStyle();
    const isVendorSelected = state.ui.isVendorSelected;
    const windowHeight = windowSizeEffects.useWindowHeight();
    const vendorSelectorLinksHeight = windowHeight - windowHeight * .19;
    const defaultScrollHeight = parseInt(expandedMenuStyle.height.substring(0, expandedMenuStyle.height.length - 2))

    // UI Effects
    const [isScrollDivExpanded, setIsScrollDivExpanded] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(defaultScrollHeight);

    // Callback function sets the height of the scroll div pending scroll up or down
    const scrollPositionCb = (params:{scrollDir:string, distanceToTop:number, distanceToBottom:number, scrollTimeStampDelta:number}) => {
        const { scrollDir, distanceToTop, distanceToBottom, scrollTimeStampDelta } = params;

        if (scrollDir === 'up') {
            // If both are 0 then the height has no overflow
            if (distanceToTop === 0 && distanceToBottom > 0) {
                setScrollHeight(defaultScrollHeight);
                setIsScrollDivExpanded(false);
            }
        } else if (scrollDir === 'down') {
            setIsScrollDivExpanded(true);

            if (topbarRef.current !== null) {
                //@ts-ignore
                const maxScrollHeight = windowHeight - topbarRef.current.offsetHeight;
                setScrollHeight(maxScrollHeight);
            }
        }
    }

    // Unclick selected vendor, if scroll div takes max height reset it  to default height
    if (!isVendorSelected && scrollHeight !== defaultScrollHeight) {
        setScrollHeight(defaultScrollHeight);
        setIsScrollDivExpanded(false);
    }
    
    // Change scroll height to on window change size or scroll change size
    const properHeight = isScrollDivExpanded ? `${scrollHeight}px` : expandedMenuStyle.height;

    return (
        // Mobile resize this flex centers
        // height: scrollHeight.toString() + 'px' ...expandedMenuStyle
        <div ref={componentRef} className="menu_mobile__wrapper" style={isMenuExpanded ? {...expandedMenuStyle, height: properHeight} : contractedMenuStyle} >
            <VendorProfile scrollPositionCb={scrollPositionCb} />
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
