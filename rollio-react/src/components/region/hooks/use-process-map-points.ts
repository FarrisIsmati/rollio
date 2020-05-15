// DEPENDENCIES
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';
import uuid from 'uuid/v1';
import moment from 'moment';

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

// UTILS
import {isActive, isLocationActive} from "../../../util";

const stringifyCoordinates = (coordinates: {lat:number, long:number}) => {
    return String(coordinates.lat) + String(coordinates.long)
};

// Processes all map points for the given region
// Currently only groups points if they are at the same exact coordinate
// Only setup for initial load, not accounting for changes to the map like FILTERS YET
const useProcessMapPoints = (props:any) => {
    const dispatch = useDispatch();
    const state = useGetAppState();

    const allVendors = state.data.vendorsAll;

    useEffect(() => {
        // Once vendor data has been loaded & if the map pins have not already been loaded
        if (Object.keys(allVendors).length && !state.loadState.areMapPinsLoaded) {
            // Sets map pins loaded state to true so this wont be called infinitely
            dispatch(setMapPinsLoadState({areMapPinsLoaded: true}))

            const sortedLocations = Object.values(allVendors).reduce( (acc:{ [s: string]: any[] }, vendor:any) => {
                // If the vendor has a location for the day
                if (isActive(vendor)) {
                    const activeLocations = vendor.locations.filter(isLocationActive);
                    activeLocations.forEach((location:any) => {
                        const coordString: string = stringifyCoordinates(location.coordinates);
                        const vendorId = `${vendor.id}-${location.truckNum}`;
                        acc[coordString] = [...(acc[coordString] || []), { vendorId, selected: false }];
                    })
                }
                return acc;
            }, {});

            const singlePins:  { [key: string]: Pin } = {};
            const groupPins: { [key: string]: GroupPin } = {};

            Object.values(sortedLocations).forEach( (location: any) => {
                if (location.length > 1) {
                    // add to group map pin to obj
                    // uuid as the id for the react list key
                    groupPins[uuid()] = { selected: false, vendors: location };
                } else {
                    // add to single map pin to obj
                    // for single pins its the first element
                    singlePins[location[0].vendorId] = location[0];
                }
            });

            dispatch(setMapPins({
                vendorsDisplayedSingle: singlePins,
                vendorsDisplayedGroup: groupPins
            }))
        }
    })
}

export default useProcessMapPoints;
