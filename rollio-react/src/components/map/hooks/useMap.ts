// HOOKS
import useGlobalState from '../../common/hooks/use-global-state';

// UTILS
import { isLocationActive} from "../../../util";

const useMap = () => {
    // Hooks
    const [globalState] = useGlobalState();

    return {
        zoomToLocation: (location:any) => {
            if (isLocationActive(location)) {
                const { coordinates } = location;
                globalState.map.flyTo({
                    center: [coordinates.long, coordinates.lat],
                    zoom: 15,
                    bearing: 0,
                    speed: .5,
                    curve: 2
                })
            } else {
                console.error(`${JSON.stringify(location)} is not an active location`);
                return false;
            }
        }
    }
}

export default useMap;
