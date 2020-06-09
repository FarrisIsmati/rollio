// DEPENDENCIES
import { useState } from 'react';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import windowSizeEffects from '../../common/hooks/use-window-size';

// INTERFACES
import { UseToggleVendorDashboardOnScreenSwitchProps } from '../interfaces';

// Gets screen size, component height, and determines scroll direction to set the vendor profile height to full height minus the navbar or leave some space inbetween
// Topbar ref is the navbar component to subtract the the total height of the screen by so the profile doesn't cover it on expansion
const useSetMobileDashboardHeightOnScroll = (props:UseToggleVendorDashboardOnScreenSwitchProps) => {
    // Effects
    const state = useGetAppState();

    const { expandedDashboardStyle, topRef } = props;

    const isVendorSelected = state.ui.isVendorSelected;
    const windowHeight = windowSizeEffects.useWindowHeight();
    const vendorLinksHeight = windowHeight - windowHeight * .19;
    const defaultScrollHeight = parseInt(expandedDashboardStyle.height.substring(0, expandedDashboardStyle.height.length - 2))

    // UI Effects
    const [isScrollDivExpanded, setIsScrollDivExpanded] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(defaultScrollHeight);
    
    // Unclick selected vendor, if scroll div takes max height reset it to default height
    if (!isVendorSelected && scrollHeight !== defaultScrollHeight) {
        setScrollHeight(defaultScrollHeight);
        setIsScrollDivExpanded(false);
    }
    
    // Change scroll height to on window change size or scroll change size
    const properHeight = isScrollDivExpanded ? `${scrollHeight}px` : expandedDashboardStyle.height;

    return {
        properHeight,
        vendorLinksHeight
    }
}

export default useSetMobileDashboardHeightOnScroll;
