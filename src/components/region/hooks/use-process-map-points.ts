// DEPENDENCIES
import { useDispatch  } from 'react-redux';
import { useEffect } from 'react';

// ACTIONS
import { setMapPin } from '../../../redux/actions/map-actions';

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
        // Once vendor data has been loaded run the process only once
        if (Object.keys(allVendors).length) {
            // STILL BUILDING CALL SETMAPPINSLOADED TO TRUE AND ADD IT TO THE IF STATEMENT TO PREVENT INFINITE LOOPS

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
        
            Object.values(sortedLocations).forEach( (vendor: any[]) => {
                if (vendor.length > 1) {
                    // add to group map pin
                } else {
                    // add to single map pin
                    const payload:any = {
                        vendorId: vendor[0].id,
                        selected: vendor[0].selected,
                        location: vendor[0].location,
                    }
                    // dispatch(setMapPin(payload))
                }
            })
        }
    })
}

export default useProcessMapPoints;
