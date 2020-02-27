// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useGlobalState from '../../common/hooks/use-global-state';

const useMap = () => {
    // Hooks
    const [globalState, setGlobalState] = useGlobalState();
    const state = useGetAppState();

    return {
        zoomToCurrentlySelectedVendor: function() {
            if (state.data.selectedVendor.id && state.data.selectedVendor.location) {
                const coords = state.data.selectedVendor.location.coordinates;
                globalState.map.flyTo({
                    center: [coords[1], coords[0]],
                    zoom: 15,
                    bearing: 0,
                    speed: .5,
                    curve: 2
                })
            } else {
                console.error('There is currently no selected vendor');
                return false;
            }
        }
    }
}

export default useMap;
