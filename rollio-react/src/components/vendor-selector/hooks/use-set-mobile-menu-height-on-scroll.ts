// DEPENDENCIES
import { useState } from 'react';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import windowSizeEffects from '../../common/hooks/use-window-size';

// INTERFACES
import { UseToggleVendorMenuOnScreenSwitchProps } from '../interfaces';

// Gets screen size, component height, and determines scroll direction to set the vendor profile height to full height minus the navbar or leave some space inbetween
// Topbar ref is the navbar component to subtract the the total height of the screen by so the profile doesn't cover it on expansion
const useSetMobileMenuHeightOnScroll = (props:UseToggleVendorMenuOnScreenSwitchProps) => {
    // Effects
    const state = useGetAppState();

    const { expandedMenuStyle, topRef } = props;

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

            if (topRef.current !== null) {
                //@ts-ignore
                const maxScrollHeight = windowHeight - topRef.current.offsetHeight;
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

    return {
        properHeight,
        scrollPositionCb,
        vendorSelectorLinksHeight
    }
}

export default useSetMobileMenuHeightOnScroll;
