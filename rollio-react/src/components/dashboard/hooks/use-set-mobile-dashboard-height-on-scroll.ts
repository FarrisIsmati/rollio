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
    const { expandedDashboardStyle } = props;

    const windowHeight = windowSizeEffects.useWindowHeight();
    const vendorLinksHeight = windowHeight - windowHeight * .19;
    const defaultScrollHeight = parseInt(expandedDashboardStyle.height.substring(0, expandedDashboardStyle.height.length - 2))

    const dashboardHeightNormal = `${defaultScrollHeight}px` 
    const dashboardHeightGroups = `${defaultScrollHeight/2}px` 

    return {
        dashboardHeightGroups,
        dashboardHeightNormal,
        vendorLinksHeight
    }
}

export default useSetMobileDashboardHeightOnScroll;
