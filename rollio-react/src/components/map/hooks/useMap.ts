// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useGlobalState from '../../common/hooks/use-global-state';

// UTILS
import {isActive, isLocationActive} from "../../../util";

const useMap = () => {
    // Hooks
    const [globalState, setGlobalState] = useGlobalState();
    const state = useGetAppState();

    return {
        zoomToCurrentlySelectedVendor: function() {
            if (state.data.selectedVendor.id && isActive(state.data.selectedVendor)) {
                const activeLocations = state.data.selectedVendor.locations.filter(isLocationActive);
                if (activeLocations.length === 1) {
                    const {coordinates} = activeLocations[0];
                    globalState.map.flyTo({
                        center: [coordinates.long, coordinates.lat],
                        zoom: 15,
                        bearing: 0,
                        speed: .5,
                        curve: 2
                    })
                } else {
                    // TODO: figure out what we want to do if they have more than one truck active at a time
                }

            } else {
                console.error('There is currently no selected vendor');
                return false;
            }
        }
    }
}

export default useMap;
