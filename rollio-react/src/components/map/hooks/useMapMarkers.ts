// DEPENDENCIES
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useUpdateMapMarkers from './useUpdateMapMarkers';

// Create Marker Style
const createMapMarker = (numberOfGroupedVendors: boolean | number = false) => {
    const mapMarkerEl = document.createElement('div');
    mapMarkerEl.className = 'map__marker_primary font__map_marker_font';

    if (numberOfGroupedVendors) {
        const textnode = document.createTextNode(numberOfGroupedVendors.toString()); 
        mapMarkerEl.appendChild(textnode);
    }

    return mapMarkerEl
}

// Adds a single pin marker to map
const addSingleVendorToMap = (vendor:any, map:any) => {
    // Current vendor location data
    const vendorLocation = vendor.location
    // Current vendor [lng,lat]
    const coordinates:[number, number] = [vendorLocation.coordinates.long, vendorLocation.coordinates.lat]

    // // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker())
        .setLngLat(coordinates)
        .addTo(map)
    
    return marker
}

// Adds a grouped pin marker to map
const addGroupedVendorsToMap = ({vendors, firstVendor, map}: any) => {  
    // First chosen vendor location data
    const firstVendorLocation = firstVendor.location
    // First vendor [lng,lat]
    const coordinates:[number, number] = [firstVendorLocation.coordinates.long, firstVendorLocation.coordinates.lat]

    // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker(vendors.length))
        .setLngLat(coordinates)
        .addTo(map)

    return marker
}

// useMapMarkers loads the initial vendor markers in a map, all live updates hereforth will be updated form another component TBD
const useMapMarkers = (props: any) => {
    const { mapType, mapData, map } = props;
    const state = useGetAppState();

    // Initial Map Markers Loaded State
    const [areMarkersLoaded, setAreMarkersLoaded] = useState(false);

    // Markers State
    // Keeps track of all markers (Marker data isn't stored on map object)
    // Reference these markers when updating/removing markers via webhooks
    const [singleVendorMarkers, setSingleVendorMarkers] = useState<any>(null);
    const [groupVendorMarkers, setGroupVendorMarkers] = useState<any>(null);

    // General variables
    const vendorsData = state.data.vendorsAll 

    // Initilization of all markers
    useEffect(() => {
        // If the map is rendered
        if (map && !areMarkersLoaded) {
            // Ensures when this component is loaded this will only run once
            setAreMarkersLoaded(true);
            if ( mapType === 'region') {
                const singleVendors = mapData.vendorsDisplayedSingle;
                const singleVendorsKeys = Object.keys(singleVendors);
                const groupVendors = mapData.vendorsDisplayedGroup;
                const groupVendorKeys = Object.keys(groupVendors);

                let singleVendorMarkersTemp = {}
                // Add single vendors to map
                for (let i = 0; i < singleVendorsKeys.length; i += 1) {
                    const key = singleVendorsKeys[i]
                    const marker = addSingleVendorToMap(vendorsData[key], map);
                    singleVendorMarkersTemp = { ...singleVendorMarkersTemp, [key]: marker }
                }
                setSingleVendorMarkers(singleVendorMarkersTemp)
                
                let groupVendorMarkersTemp = {}
                // Add grouped pin vendors to map
                for (let i = 0; i < groupVendorKeys.length; i += 1) {
                    const key = groupVendorKeys[i];
                    const vendors = groupVendors[key];
                    // Since all vendors in a grouped pin location currently have the same exact coords (not a area/radius thing) 
                    // Take the first vendors coords and use that to make a marker
                    const firstVendor = vendorsData[vendors[0].vendorId]
                    const marker = addGroupedVendorsToMap({vendors, firstVendor, map});
                    groupVendorMarkersTemp = { ...groupVendorMarkersTemp, [key]: marker }
                }
                setGroupVendorMarkers(groupVendorMarkersTemp)
            }
        }
    }, [map])

    // Sets map markers in real time
    useUpdateMapMarkers({
        map,
        singleVendorMarkers, 
        setSingleVendorMarkers,
        addSingleVendorToMap, 
        groupVendorMarkers, 
        setGroupVendorMarkers,
        addGroupedVendorsToMap,
    })
}


export default useMapMarkers;
