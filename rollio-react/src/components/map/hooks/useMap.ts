// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useGlobalState from '../../common/hooks/use-global-state';

const useMap = () => {
    // Hooks
    const [globalState, setGlobalState] = useGlobalState();
    const state = useGetAppState();

    return {
        zoomToCurrentlySelectedVendor: function() {
            if (state.data.selectedVendor.id && state.data.selectedVendor.isActive()) {
                const {locations} = state.data.state.data.selectedVendor;
                if (locations.length === 1) {
                    const {coordinates} = locations[0];
                    globalState.map.flyTo({
                        center: [coordinates[1], coordinates[0]],
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
