// DEPENDENCIES
import { toNumber } from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useUpdateMapMarkersState from './useUpdateMapMarkersState';
import useUpdateMapMarkersStyle from './useUpdateMapMarkersStyle';
import {getCurrentTruckLocation, isLocationActive} from "../../../util";
import useSelectVendorProfile from '../../vendor-profile/hooks/use-select-vendor-profile';
import useSelectGroupedVendors from '../../dashboard/hooks/use-select-grouped-vendors';

// INTERFACES
import { 
    CreateMapMarkerProps, 
    AddSingleVendorToMapProps, 
    AddGroupedVendorsToMapProps 
} from './interfaces';

// Create Marker Style
const createMapMarker = (props: CreateMapMarkerProps) => {
    const { vendor, vendors, selected, onClickVendor, key} = props;

    const mapMarkerEl = document.createElement('div');

    if (!selected) {
        mapMarkerEl.className = 'map__marker_default font__map_marker_font';
    } else {
        mapMarkerEl.className = 'map__marker_selected font__map_marker_font';
    }

    // If multiple vendors/grouped vendor (add number to marker)
    if (vendors) {
        const textnode = document.createTextNode(vendors.length.toString());
        mapMarkerEl.appendChild(textnode);
    }

    // Perform vendor selection action when click on element
    if (onClickVendor) {
        mapMarkerEl.onclick = () => {
            if (vendor) {
                onClickVendor(vendor.id);
            } else if (vendors) {
                onClickVendor(key);
            }
        }
    }

    return mapMarkerEl
}

// Adds a single pin marker to map
const addSingleVendorToMap = (props: AddSingleVendorToMapProps) => {
    const { vendor, map, selected, location, onClickVendor } = props;
    // Current vendor [lng,lat]
    const coordinates:[number, number] = [location.coordinates.long, location.coordinates.lat];

    // // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker({vendor, selected, location, onClickVendor }))
        .setLngLat(coordinates)
        .addTo(map)

    return marker
}

// Adds a grouped pin marker to map
const addGroupedVendorsToMap = (props: AddGroupedVendorsToMapProps) => {
    const {vendors, location, map, selected, onClickVendor, key } = props;
    // [lng,lat]
    const coordinates:[number, number] = [location.coordinates.long, location.coordinates.lat];
    // Add marker to map
    const marker = new mapboxgl.Marker(createMapMarker({ vendors, selected, location, onClickVendor, key }))
        .setLngLat(coordinates)
        .addTo(map);

    return marker
};

// useMapMarkers loads the initial vendor markers in a map, all live updates hereforth will be updated form another component TBD
const useMapMarkers = (props: any) => {
    const { mapType, mapData, map } = props;
    const state = useGetAppState();
    const dispatch = useDispatch();
    
    // Initial Map Markers Loaded State
    const [areMarkersLoaded, setAreMarkersLoaded] = useState(false);

    /*  
    Markers State
    Keeps track of all markers (Marker data isn't stored on map object)
    Reference these markers when updating/removing markers via webhooks
    */ 
    const [singleVendorMarkers, setSingleVendorMarkers] = useState<any>(null);
    const [groupVendorMarkers, setGroupVendorMarkers] = useState<any>(null);

    // General variables
    const vendorsData = state.data.vendorsAll;

    // Hook function to pass into all createMapMarker functions that require vendors to be selected
   const selectVendorProfile = useSelectVendorProfile();
   const selectGroupedVendors = useSelectGroupedVendors();

    /* Ref keeps track of when you can render the points
       If rendered too early the globalState map reference will be the old map and points wont attach,
       Ref keeps track of when map gets set to null so it resets
    */
   const isMapRestRef:any = useRef(false);
   if (!map) {
    isMapRestRef.current = true;
    }

    // Initilization of all markers
    useEffect(() => {
        // If the map is rendered && Reset
        if (map && !areMarkersLoaded && isMapRestRef.current) {
            // Ensures when this component is loaded this will only run once
            setAreMarkersLoaded(true);
            if ( mapType === 'region') {
                const {vendorsDisplayedSingle, vendorsDisplayedGroup} = mapData;
                // add single pins to map
                const singleVendorMarkersTemp = Object.keys(vendorsDisplayedSingle).reduce((acc: { [key: string]: any }, key: string) => {
                    // each key is a 'vendorID-truckNum'...if there are multiple trucks for a vendor, there will be multiple keys for a vendor
                    const [vendorID, truckNum] = key.split('-');
                    const vendor = vendorsData[vendorID];
                    const {selected, locations} = vendor;
                    locations.forEach((location:any, index:number) => {
                        if (isLocationActive(location) && location.truckNum === toNumber(truckNum)) {
                            acc[key] = addSingleVendorToMap({ map, selected, location, vendor, onClickVendor: selectVendorProfile });
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
                    acc[key] = addGroupedVendorsToMap({vendors, location, map, selected, onClickVendor: selectGroupedVendors, key});
                    return acc;
                }, {});
                setGroupVendorMarkers(groupVendorMarkersTemp)
            }
        }
    })

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
