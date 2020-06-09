// DEPENDENCIES
import { toNumber } from 'lodash';
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useUpdateMapMarkersState from './useUpdateMapMarkersState';
import useUpdateMapMarkersStyle from './useUpdateMapMarkersStyle';
import {getCurrentTruckLocation, isLocationActive} from "../../../util";

// Create Marker Style
const createMapMarker = (props: { numberOfGroupedVendors?: boolean | number, selected: boolean }) => {
    const { numberOfGroupedVendors, selected } = props;

    const mapMarkerEl = document.createElement('div');

    if (!selected) {
        mapMarkerEl.className = 'map__marker_default font__map_marker_font';
    } else {
        mapMarkerEl.className = 'map__marker_selected font__map_marker_font';
    }

    if (numberOfGroupedVendors) {
        const textnode = document.createTextNode(numberOfGroupedVendors.toString());
        mapMarkerEl.appendChild(textnode);
    }

    return mapMarkerEl
}

// Adds a single pin marker to map
const addSingleVendorToMap = (props: { map:any, selected: boolean, location:any }) => {
    const { map, selected, location } = props;
    // Current vendor [lng,lat]
    const coordinates:[number, number] = [location.coordinates.long, location.coordinates.lat];

    // // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker({selected}))
        .setLngLat(coordinates)
        .addTo(map)

    return marker
}

// Adds a grouped pin marker to map
const addGroupedVendorsToMap = (props: { vendors:any, map:any, selected: boolean, location: any }) => {
    const {vendors, location, map, selected} = props;
    // [lng,lat]
    const coordinates:[number, number] = [location.coordinates.long, location.coordinates.lat];
    // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker({ numberOfGroupedVendors: vendors.length, selected }))
        .setLngLat(coordinates)
        .addTo(map);

    return marker
};

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
    const vendorsData = state.data.vendorsAll;

    // Initilization of all markers
    useEffect(() => {
        // If the map is rendered
        if (map && !areMarkersLoaded) {
            // Ensures when this component is loaded this will only run once
            setAreMarkersLoaded(true);
            if ( mapType === 'region') {
                const {vendorsDisplayedSingle, vendorsDisplayedGroup} = mapData;
                // add single pins to map
                const singleVendorMarkersTemp = Object.keys(vendorsDisplayedSingle).reduce((acc: { [key: string]: any }, key: string) => {
                    const vendor = vendorsData[key.split('-')[0]];
                    const {selected, locations} = vendor;
                    locations.forEach((location:any, index:number) => {
                        if (isLocationActive(location)) {
                            acc[key] = addSingleVendorToMap({ map, selected, location });
                        }
                    });
                    return acc;
                }, {});
                setSingleVendorMarkers(singleVendorMarkersTemp);

                // Add grouped pin vendors to map
                const groupVendorMarkersTemp = Object.entries(vendorsDisplayedGroup).reduce((acc: { [key: string]: any }, entry: [string, any]) => {
                    const [key, vendorsGroup] = entry;
                    // Since all vendors in a grouped pin location currently have the same exact coords (not a area/radius thing)
                    // Take the first vendors coords and use that to make a marker
                    const [firstVendorId, truckNum] = vendorsGroup.vendors[0].vendorId.split('-');
                    const {vendors, selected} = vendorsGroup;
                    const location = getCurrentTruckLocation(firstVendorId, toNumber(truckNum), vendorsData);
                    acc[key] = addGroupedVendorsToMap({vendors, location, map, selected });
                    return acc;
                }, {});
                setGroupVendorMarkers(groupVendorMarkersTemp)
            }
        }
    }, [map])

    // Sets map markers in real time
    useUpdateMapMarkersState({
        map,
        singleVendorMarkers,
        setSingleVendorMarkers,
        addSingleVendorToMap,
        groupVendorMarkers,
        setGroupVendorMarkers,
        addGroupedVendorsToMap,
    });

    // Update map markers style
    useUpdateMapMarkersStyle({
        singleVendorMarkers,
        setSingleVendorMarkers,
        addSingleVendorToMap,
        groupVendorMarkers,
        setGroupVendorMarkers,
        addGroupedVendorsToMap
    })
}

export default useMapMarkers;
