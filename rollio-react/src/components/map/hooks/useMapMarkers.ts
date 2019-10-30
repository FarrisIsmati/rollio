// DEPENDENCIES
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

const useMapMarkers = (props: any) => {
    const { mapType, mapData, map } = props;

    // Get state
    const state = useGetAppState();

    // Set single map markers
    const [singleMapMarkers, setSingleMapMarkers] = useState({});

    const vendorsData = state.data.vendorsAll 

    if ( mapType === 'region') {
        const singleVendors = mapData.vendorsDisplayedSingle;
        const singleVendorsKeys = Object.keys(mapData.vendorsDisplayedSingle);
    
        for (let i = 0; i < singleVendorsKeys.length; i += 1) {
            // Current vendor key
            const key = singleVendorsKeys[i]
            // Current vendor
            const vendor = vendorsData[key]
            // Current vendor location data
            const vendorLocation = vendor.location
            // Current vendor [lng,lat]
            const coordinates:[number, number] = [vendorLocation.coordinates.long, vendorLocation.coordinates.lat]
            console.log(coordinates)
            // Add marker to map
            const marker = new mapboxgl.Marker()
                .setLngLat(coordinates)
                .addTo(map)

            // Add marker to local map state
            setSingleMapMarkers({...singleMapMarkers, [key]: marker})
        }
        // mapMarkers[0]
        //   .setLngLat([-77.036873, 38.907192])
        // Review how to add markers to the maps
        // What happens if you select them

        // Consider how map should take in points
        // What types of maps will be rendered
            // Region maps, single vendor maps
            // Should map look at redux or be fed data from Parent => Child props
            // Currently think I should expand its functionality once I determine what all the parameters will be so scale it after I build it
            // All data should be takin in from props, not directly from Redux
    }

}

export default useMapMarkers;