// DEPENDENCIES
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';
import uuid from 'uuid/v1';

// ACTIONS
import { 
    setMapPins,
    setMapPinsLoadState
 } from '../../../redux/actions/map-actions';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// INTERFACES
import { 
    Pin,
    GroupPin
} from '../../../redux/reducers/interfaces';

const stringifyCoordinates = (coordinates: {lat:number, long:number}) => {
    return String(coordinates.lat) + String(coordinates.long)
} 

// Processes all map points for the given region
// Currently only groups points if they are at the same exact coordinate
// Only setup for initial load, not accounting for changes to the map like FILTERS YET
const useProcessMapPoints = (props:any) => {
    const dispatch = useDispatch();
    const state = useGetAppState();

    const allVendors = state.data.vendorsAll

    useEffect(() => {
        // Once vendor data has been loaded & if the map pins have not already been loaded
        if (Object.keys(allVendors).length && !state.loadState.areMapPinsLoaded) {
            // Sets map pins loaded state to true so this wont be called infinitely 
            dispatch(setMapPinsLoadState({areMapPinsLoaded: true}))

            const sortedLocations: { [s: string]: any[] } = {};

            Object.values(allVendors).forEach( (vendor:any) => {
                const isActive = vendor.isActive;
                // If the vendor has a location for the day
                if (isActive && vendor.location !== null) {
                    const coordString: string = stringifyCoordinates(vendor.location.coordinates);
                    // Add value to sortedLocations
                    if (sortedLocations[coordString]) {
                        sortedLocations[coordString].push({ vendorId: vendor.id, selected: false });
                    } else {
                        sortedLocations[coordString] = [];
                        sortedLocations[coordString].push({ vendorId: vendor.id, selected: false });
                    }
                }
            });

            const singlePins:  { [key: string]: Pin } = {};
            const groupPins: { [key: string]: GroupPin } = {};

            Object.values(sortedLocations).forEach( (vendor: any) => {
                if (vendor.length > 1) {
                    // add to group map pin to obj
                    // uuid as the id for the react list key
                    groupPins[uuid()] = vendor;
                } else {
                    // add to single map pin to obj
                    // for single pins its the first element
                    singlePins[vendor[0].vendorId] = vendor[0];
                }
            })

            dispatch(setMapPins({
                vendorsDisplayedSingle: singlePins,
                vendorsDisplayedGroup: groupPins
            }))
        }
    })
}

export default useProcessMapPoints;
