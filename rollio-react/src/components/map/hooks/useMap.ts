// DEPENDENCIES
import { useState } from 'react';

// HOOKS
import useGlobalState from '../../common/hooks/use-global-state';

const useMap = () => {
    const [globalState, setGlobalState] = useGlobalState();

    return {
        zoomToMarker: function(marker:any) {
            globalState.map.flyTo({
                // These options control the ending camera position: centered at
                // the target, at zoom level 9, and north up.
                center: [0,0],
                zoom: 3,
                bearing: 0,
                 
                // These options control the flight curve, making it move
                // slowly and zoom out almost completely before starting
                // to pan.
                speed: 0.8, // make the flying slow
                curve: 1, // change the speed at which it zooms out

                 
                // this animation is considered essential with respect to prefers-reduced-motion
                essential: true
            })
        }
    }
}


export default useMap;
