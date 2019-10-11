// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

const stringifyCoordinates = (coordinates: {lat:number, long:number}) => {
    return String(coordinates.lat) + String(coordinates.long)
} 

// Processes all map points for the given region
// Currently only groups points if they are at the same exact coordinate
const useProcessMapPoints = (props:any) => {
    const allVendors = useGetAppState().data.vendorsAll;
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

    Object.values(sortedLocations).forEach( (location: any[]) => {
        if (location.length > 1) {
            // add to group map pin
        } else {
            // add to single map pin
        }
    })
}

export default useProcessMapPoints;
