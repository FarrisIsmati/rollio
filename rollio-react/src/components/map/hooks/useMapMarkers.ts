// DEPENDENCIES
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useCustom from '../../region/hooks/use-current-update-vendor-id-state'

// INTERFACES
import { MarkerComparisonObject } from './interfaces';

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
const addSingleVendorToMap = ({i, singleVendorsKeys, vendorsData, singleVendorMarkers, setSingleVendorMarkers, map} : any) => {
    // Current vendor key
    const key = singleVendorsKeys[i]
    // Current vendor
    const vendor = vendorsData[key]
    // Current vendor location data
    const vendorLocation = vendor.location
    // Current vendor [lng,lat]
    const coordinates:[number, number] = [vendorLocation.coordinates.long, vendorLocation.coordinates.lat]

    // // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker())
        .setLngLat(coordinates)
        .addTo(map)

    setSingleVendorMarkers({ ...singleVendorMarkers, [key]: marker })
}

// Adds a grouped pin marker to map
const addGroupedVendorsToMap = ({i, groupVendorKeys, groupVendors, vendorsData, groupVendorMarkers, setGroupVendorMarkers, map}: any) => {
    const key = groupVendorKeys[i];
    const vendors = groupVendors[key];

    // Since all vendors in a grouped pin location currently have the same exact coords (not a area/radius thing) 
    // Take the first vendors coords and use that to make a marker
    const firstVendor = vendorsData[vendors[0].vendorId]
    // First chosen vendor location data
    const firstVendoLocation = firstVendor.location
    // First vendor [lng,lat]
    const coordinates:[number, number] = [firstVendoLocation.coordinates.long, firstVendoLocation.coordinates.lat]

    // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker(vendors.length))
        .setLngLat(coordinates)
        .addTo(map)
 
    setGroupVendorMarkers({ ...groupVendorMarkers, [key]: marker })
}

// useMapMarkers loads the initial vendor markers in a map, all live updates hereforth will be updated form another component TBD
const useMapMarkers = (props: any) => {
    const { mapType, mapData, map } = props;
    const state = useGetAppState();
    
    // Way to get data from tweet stream without storing it in Redux
    const [globalState] = useCustom();
    
    // Initial Map Markers Loaded State
    const [areMarkersLoaded, setAreMarkersLoaded] = useState(false);

    // Markers State
    // Keeps track of all markers (Marker data isn't stored on map object)
    // Reference these markers when updating/removing markers via webhooks
    const [singleVendorMarkers, setSingleVendorMarkers] = useState(null);
    const [groupVendorMarkers, setGroupVendorMarkers] = useState(null);

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
                
                // Add single vendors to map
                for (let i = 0; i < singleVendorsKeys.length; i += 1) {
                    addSingleVendorToMap({i, singleVendorsKeys, vendorsData, singleVendorMarkers, setSingleVendorMarkers, map});
                }
                
                // Add grouped pin vendors to map
                for (let i = 0; i < groupVendorKeys.length; i += 1) {
                    addGroupedVendorsToMap({i, groupVendorKeys, groupVendors, vendorsData, groupVendorMarkers, setGroupVendorMarkers, map});
                }
            }
        }
    }, [map])

    const currentVendorID = globalState.vendorID;

    // Custom use effect which will only run the update marker coordinates code if it's necessary
    // For example if the coordinates of the current & previous iterations are the same it will not run, unless it's another vendor
    useEffectMarkerComparisonObject(() => {
        if (currentVendorID) {
            // @ts-ignore: singleVendorMarkers wont be null
            if (singleVendorMarkers !== null && singleVendorMarkers[currentVendorID]) {
                console.log('Update Single Vendor')
                const currentVendorCoords = state.data.vendorsAll[currentVendorID].location.coordinates;
                // @ts-ignore: singleVendorMarkers wont be null
                singleVendorMarkers[currentVendorID]
                    .setLngLat([currentVendorCoords[1], currentVendorCoords[0]]);
            }
            // If current vendor is a single vendor
                // If current vendor is joining a group
                // If current vendor is solo
            // If current vendor is in a group
                // If current vendor is joining a new group
                // If current vendor is leaving group
            // If current vendor is new
                // If current vendor is solo
                // If current vendor is joining a group
        }
    }, markerObjectComparisonState(state, currentVendorID))
}

// Return the marker comparison object which needs to be compared
const markerObjectComparisonState = (state:any, currentVendorID:string) => {
    if (currentVendorID !== null) {
        return {
            currentVendorID,
            coordinates: state.data.vendorsAll[currentVendorID].location.coordinates
        }
    } 
    return {
        currentVendorID: 'undefined',
        coordinates: [0,0]
    }
}

// Idea taken from a SO answer https://stackoverflow.com/questions/55808749/use-object-in-useeffect-2nd-param-without-having-to-stringify-it-to-json
const useEffectMarkerComparisonObject = (fn:any, deps:MarkerComparisonObject) => {
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);

    useEffect(() => {
        let isSame = false;
        if (
            prevDeps.current.currentVendorID === deps.currentVendorID && 
            prevDeps.current.coordinates[0] === deps.coordinates[0] && 
            prevDeps.current.coordinates[1] === deps.coordinates[1]) 
        {
            isSame = true;
        }

        if (isFirst.current || !isSame) {
            fn();
        }

        isFirst.current = false;
        prevDeps.current = deps;
    });
}

export default useMapMarkers;
