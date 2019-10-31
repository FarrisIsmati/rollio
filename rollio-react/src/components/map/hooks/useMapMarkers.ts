// DEPENDENCIES
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// INTERFACES
import { AddSingleVendorProps, AddGroupVendorsProps } from './interfaces';

// Adds a single pin marker to map
const addSingleVendorToMap = ({i, singleVendorsKeys, vendorsData, map} : AddSingleVendorProps) => {
    // Current vendor key
    const key = singleVendorsKeys[i]
    // Current vendor
    const vendor = vendorsData[key]
    // Current vendor location data
    const vendorLocation = vendor.location
    // Current vendor [lng,lat]
    const coordinates:[number, number] = [vendorLocation.coordinates.long, vendorLocation.coordinates.lat]

    // // Add marker to map
    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
}

// Adds a grouped pin marker to map
const addGroupedVendorsToMap = ({i, groupVendorKeys, groupVendors, vendorsData, map}: AddGroupVendorsProps) => {
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
    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
}

const useMapMarkers = (props: any) => {
    const { mapType, mapData, map } = props;
    const state = useGetAppState();

    // General variables
    const vendorsData = state.data.vendorsAll 

    // ***~~~ SHOULD BE ONLY INIT ADDING OF MAP MARKERS TO MAP, AFTER ADDED DONT DO IT AGAIN, REST DATA GETS UPDATED FROM WEBHOOKS ~~~~***
    useEffect(() => {
        // If the map is rendered
        if (map) {
            if ( mapType === 'region') {
                const singleVendors = mapData.vendorsDisplayedSingle;
                const singleVendorsKeys = Object.keys(singleVendors);
                const groupVendors = mapData.vendorsDisplayedGroup;
                const groupVendorKeys = Object.keys(groupVendors);
                
                // Add single vendors to map
                for (let i = 0; i < singleVendorsKeys.length; i += 1) {
                    addSingleVendorToMap({i, singleVendorsKeys, vendorsData, map});
                }
                
                // Add grouped pin vendors to map
                for (let i = 0; i < groupVendorKeys.length; i += 1) {
                    addGroupedVendorsToMap({i, groupVendorKeys, groupVendors, vendorsData, map});
                }
            }
        }
    }, [map])
}

export default useMapMarkers;