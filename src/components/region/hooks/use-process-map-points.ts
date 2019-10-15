// DEPENDENCIES
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';

// ACTIONS
import { 
    setMapPin,
    setMapPinsLoadState
 } from '../../../redux/actions/map-actions';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

const stringifyCoordinates = (coordinates: {lat:number, long:number}) => {
    return String(coordinates.lat) + String(coordinates.long)
} 

// Processes all map points for the given region
// Currently only groups points if they are at the same exact coordinate
const useProcessMapPoints = (props:any) => {
    const dispatch = useDispatch();
    const state = useGetAppState();

    const allVendors = state.data.vendorsAll

    useEffect(() => {
        // Once vendor data has been loaded & if the map pins have not already been loaded
        if (Object.keys(allVendors).length && !state.loadState.areMapPinsLoaded) {
            dispatch(setMapPinsLoadState({areMapPinsLoaded: true}))

            const sortedLocations: { [s: string]: any[] } = {};

            Object.values(allVendors).forEach( (vendor:any) => {
                const isActive = vendor.isActive;
                // If the vendor has a location for the day
                if (isActive && vendor.location !== null) {
                    const coordString: string = stringifyCoordinates(vendor.location.coordinates);
                    // Add value to sortedLocations
                    if (sortedLocations[coordString]) {
                        sortedLocations[coordString].push(vendor);
                    } else {
                        sortedLocations[coordString] = [];
                        sortedLocations[coordString].push(vendor);
                    }
                }
            });

            const singlePins: any[] = [];
            const groupPins: any[] = [];
        
            Object.values(sortedLocations).forEach( (vendor: any[]) => {
                if (vendor.length > 1) {
                    // add to group map pin
                    groupPins.push(vendor);
                } else {
                    // add to single map pin
                    singlePins.push(vendor);
                }
            })

            // const payload:any = {
            //     vendorId: vendor[0].id,
            //     selected: vendor[0].selected,
            //     location: vendor[0].location,
            // }
            // dispatch(setMapPin(payload))
        }
    })
}

export default useProcessMapPoints;
