// DEPENDENCIES
import { useEffect, useRef } from 'react';
import { useDispatch  } from 'react-redux';
import uuid from 'uuid/v1';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import useCustom from '../../region/hooks/use-current-update-vendor-id-state'

// ACTIONS
import { 
    setVendorsDisplayedSingle, 
    setVendorsDisplayedGroup 
} from '../../../redux/actions/map-actions';

// INTERFACES
import { MarkerComparisonObject } from './interfaces';

const useUpdateMapMarkers = (props: any) => {
    // Way to get data from tweet stream without storing it in Redux
    const [globalState] = useCustom();
    const dispatch = useDispatch();
    const state = useGetAppState();
    const currentVendorID = globalState.vendorID;

    const {
        map,
        singleVendorMarkers, 
        setSingleVendorMarkers, 
        groupVendorMarkers, 
        setGroupVendorMarkers,
        addGroupedVendorsToMap,
    } = props;

    // Custom use effect which will only run the update marker coordinates code if it's necessary
    // For example if the coordinates of the current & previous iterations are the same it will not run, unless it's another vendor
    useEffectMarkerComparisonObject(() => {
        if (currentVendorID) {
            
            // Step 1
            // If current vendor is a single vendor
                // If current vendor is joining another single vendor
                // If current vendor is joining a group
                // If current vendor is solo

            // @ts-ignore: singleVendorMarkers wont be null
            if (singleVendorMarkers !== null && singleVendorMarkers[currentVendorID]) {
                console.log('Update Single Vendor')
                const currentVendor = state.data.vendorsAll[currentVendorID]
                const currentVendorCoords = currentVendor.location.coordinates;

                // If new coordinates are the same as another single vendor's coordinates
                for (const key in singleVendorMarkers) {
                    const currentIteratedVendor = state.data.vendorsAll[key]
                    const marker = singleVendorMarkers[key];
                    const markerCoords = marker.getLngLat();
                    if (key !== currentVendorID && markerCoords.lng === currentVendorCoords.long && markerCoords.lat === currentVendorCoords.lat) {
                        // Remove both single vendor markers from map
                        marker.remove()
                        singleVendorMarkers[currentVendorID].remove()
                        // Remove both single vendors from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[key]
                        delete updatedSingleVendorMarkers[currentVendorID]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        // Remove both single vendors from vendorsDisplayedSingle Redux

                        // Getting a copy of the redux data before it's removed to use later for the new group
                        const currentSingleVendorMarker = { ...state.regionMap.vendorsDisplayedSingle[currentVendorID] }
                        const iteratedSingleVendorMarker =  { ...state.regionMap.vendorsDisplayedSingle[key] }

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[key]
                        delete updatedVendorsDisplayedSingle[currentVendorID]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))
                        
                        // Add grouped vendor marker to map
                        const groupedMarker = addGroupedVendorsToMap({vendors:[currentVendor, currentIteratedVendor], firstVendor: currentVendor, map});
                        // Add grouped vendors to groupVendorMarkers state
                        const newGroupedMarkerID = uuid()
                        setGroupVendorMarkers({ ...groupVendorMarkers, [newGroupedMarkerID]: groupedMarker })
                        // Add both vendors to vendorsDisplayedGroup Redux
                        const updatedVendorsDisplayedGroup = { ...state.regionMap.vendorsDisplayedGroup, [newGroupedMarkerID]: [currentSingleVendorMarker, iteratedSingleVendorMarker] }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))
                        return
                    }
                }


                // If new coordinates lie within a grouped vendors coordinates
                for (const key in groupVendorMarkers) {
                    const marker = groupVendorMarkers[key];
                    const markerCoords = marker.getLngLat();
                    if (key !== currentVendorID && markerCoords.lng === currentVendorCoords.long && markerCoords.lat === currentVendorCoords.lat) {
                        // Remove single vendor marker from map
                        singleVendorMarkers[currentVendorID].remove()
                        // Remove single vendor from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[currentVendorID]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        // Remove single vendor from vendorsDisplayedSingle Redux

                        // Getting a copy of the redux data before it's removed to use later for the new group
                        const currentVendorMarker = { ...state.regionMap.vendorsDisplayedSingle[currentVendorID] }
                        const currentGroupVendorMarker =  [ ...state.regionMap.vendorsDisplayedGroup[key] ]

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[currentVendorID]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))

                        // Increment grouped vendor marker being added to on map
                        const totalNumberOfVendors = marker.getElement().innerHTML
                        marker.getElement().innerHTML = parseInt(totalNumberOfVendors) + 1
                        // Add vendor to vendorsDisplayedGroup Redux
                        const updatedVendorsDisplayedGroup = { ...state.regionMap.vendorsDisplayedGroup, [key]: [currentVendorMarker, ...currentGroupVendorMarker] }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))
                        return
                    }
                }
                
                // If new coordinates is going to a completely new coordinate
                // @ts-ignore: singleVendorMarkers wont be null
                singleVendorMarkers[currentVendorID]
                    .setLngLat([currentVendorCoords.long, currentVendorCoords.lat]);
                return
            }

            const isCurrentVendorInGroup = () => {
                const groupVendorsRedux = state.regionMap.vendorsDisplayedGroup
                let shouldContinue = true
                for (const id in groupVendorsRedux) {
                    const group = groupVendorsRedux[id]
                    for (const i in group) {
                        const vendor = group[i]
                        if (vendor.vendorId === currentVendorID) {
                            return {
                                continue: true,
                                groupID: id,
                                vendorInRedux: vendor
                            }
                        }
                    }
                }
                return {
                    continue: false
                }
            }

            // Step 2
            // If current vendor is in a group
                // If new coordinates are the same as another single vendor's coordinates
                // If new coordinates lie within a grouped vendors coordinates
                // If new coordinates is going to a completely new coordinate
            if (isCurrentVendorInGroup().continue) {

            }


            // Step 3
            // If current vendor is new
                // If new coordinates are the same as another single vendor's coordinates
                // If new coordinates lie within a grouped vendors coordinates
                // If new coordinates is going to a completely new coordinate
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
        coordinates: {lat: 0, lng: 0}
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
            prevDeps.current.coordinates.lat === deps.coordinates.lat && 
            prevDeps.current.coordinates.lng === deps.coordinates.lng) 
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

export default useUpdateMapMarkers;
