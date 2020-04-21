// DEPENDENCIES
import React from 'react';

// HOOKS
import useState from '../common/hooks/use-get-app-state';
import windowSizeEffects from '../common/hooks/use-window-size';
import { useEffect } from 'react';

const MapOverlay = () => {
    // Effects
    const windowHeight = windowSizeEffects.useWindowHeight();
    const isMobile = windowSizeEffects.useIsMobile();
    const state = useState();

    return (
        <React.Fragment>
            { isMobile ?
            <div style={{height: `${windowHeight - 200}px`}} className={ state.ui.isMobileDashboardExpanded ? 'map__overlay_active' : 'map__overlay_inactive' }></div> :
            null
            }
        </React.Fragment>
    );
}

export default MapOverlay;

