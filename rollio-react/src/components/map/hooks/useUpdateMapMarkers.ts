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
            const currentVendorData = state.data.vendorsAll[currentVendorID]
            const currentVendorCoords = currentVendorData.location.coordinates;

            // If current vendor is a single vendor
            // @ts-ignore: singleVendorMarkers wont be null
            if (singleVendorMarkers !== null && singleVendorMarkers[currentVendorID]) {
                console.log('Update Single Vendor')
                // If new coordinates are the same as another single vendor's coordinates
                for (const key in singleVendorMarkers) {
                    const iteratedVendorData = state.data.vendorsAll[key]
                    const iteratedVendorMarker = singleVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (key !== currentVendorID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // Remove both single vendor markers from map
                        iteratedVendorMarker.remove()
                        singleVendorMarkers[currentVendorID].remove()
                        // Remove both single vendors from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[key]
                        delete updatedSingleVendorMarkers[currentVendorID]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        // Remove both single vendors from vendorsDisplayedSingle Redux

                        // Getting a copy of the redux data before it's removed to use later for the new group
                        const currentDisplayedVendorData = { ...state.regionMap.vendorsDisplayedSingle[currentVendorID] }
                        const iteratedDisplayedVendorData =  { ...state.regionMap.vendorsDisplayedSingle[key] }

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[key]
                        delete updatedVendorsDisplayedSingle[currentVendorID]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))
                        
                        // Add grouped vendor marker to map
                        const newMarker = addGroupedVendorsToMap({vendors:[currentVendorData, iteratedVendorData], firstVendor: currentVendorData, map});
                        // Add grouped vendors to groupVendorMarkers state
                        const newMarkerID = uuid()
                        setGroupVendorMarkers({ ...groupVendorMarkers, [newMarkerID]: newMarker })
                        // Add both vendors to vendorsDisplayedGroup Redux
                        const updatedVendorsDisplayedGroup = { ...state.regionMap.vendorsDisplayedGroup, [newMarkerID]: [currentDisplayedVendorData, iteratedDisplayedVendorData] }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))
                        return
                    }
                }


                // If new coordinates lie within a grouped vendors coordinates
                for (const key in groupVendorMarkers) {
                    const iteratedVendorMarker = groupVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (key !== currentVendorID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // Remove single vendor marker from map
                        singleVendorMarkers[currentVendorID].remove()
                        // Remove single vendor from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[currentVendorID]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        // Remove single vendor from vendorsDisplayedSingle Redux

                        // Getting a copy of the redux data before it's removed to use later for the new group
                        const currentDisplayedVendorData = { ...state.regionMap.vendorsDisplayedSingle[currentVendorID] }
                        const iteratedDisplayedVendorsData =  [ ...state.regionMap.vendorsDisplayedGroup[key] ]

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[currentVendorID]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))

                        // Increment grouped vendor marker
                        const vendorsCount = iteratedVendorMarker.getElement().innerHTML
                        iteratedVendorMarker.getElement().innerHTML = parseInt(vendorsCount) + 1
                        // Add vendor to vendorsDisplayedGroup Redux
                        const updatedVendorsDisplayedGroup = { ...state.regionMap.vendorsDisplayedGroup, [key]: [currentDisplayedVendorData, ...iteratedDisplayedVendorsData] }
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

            const isCurrentVendorInGroup = (() => {
                const vendorsDisplayedGroup = state.regionMap.vendorsDisplayedGroup
                for (const id in vendorsDisplayedGroup) {
                    const group = vendorsDisplayedGroup[id]
                    for (const i in group) {
                        const vendor = group[i]
                        if (vendor.vendorId === currentVendorID) {
                            return {
                                continue: true,
                                groupID: id,
                                currentDisplayedVendorData: vendor,
                                index: i
                            }
                        }
                    }
                }
                return {
                    continue: false,
                    groupID: null,
                    currentDisplayedVendorData: null,
                    index: null
                }
            })()

            // Step 2
            // If current vendor is in a group
            if (isCurrentVendorInGroup.continue) {
                console.log('Update Group Vendor')
                const { groupID, index, currentDisplayedVendorData } = isCurrentVendorInGroup;
                // @ts-ignore: Create type for this in future
                const currentVendorMarker = groupVendorMarkers[groupID];

                // If new coordinates are the same as another single vendor's coordinates
                for (const key in singleVendorMarkers) {
                    const iteratedVendorData = state.data.vendorsAll[key]
                    const iteratedVendorMarker = singleVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (key !== currentVendorID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Remove single vendor marker from map
                        iteratedVendorMarker.remove()

                        // 2. Remove iterated vendor from vendorsDisplayedSingle Redux
                        const iteratedDisplayedVendorData = { ...state.regionMap.vendorsDisplayedSingle[key] }
                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[key]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))
                        
                        // 3. Remove current vendor from current vendorsDisplayedGroup Redux 
                        // @ts-ignore
                        const oldVendorsDisplayedGroup = state.regionMap.vendorsDisplayedGroup[groupID]
                        oldVendorsDisplayedGroup.splice(index,1)
                        // @ts-ignore
                        const updatedVendorsDisplayedGroup = { ...state.regionMap.vendorsDisplayedGroup, [groupID]: oldVendorsDisplayedGroup }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))

                        // 4. Decrement grouped vendor marker
                        const vendorsCount = currentVendorMarker.getElement().innerHTML
                        currentVendorMarker.getElement().innerHTML = parseInt(vendorsCount) - 1
                        
                        // 5. Add grouped vendor marker to map
                        const newMarker = addGroupedVendorsToMap({vendors:[currentVendorData, iteratedVendorData], firstVendor: currentVendorData, map});

                        // 6. Add grouped vendors to groupVendorMarkers state
                        const newMarkerID = uuid()
                        setGroupVendorMarkers({ ...groupVendorMarkers, [newMarkerID]: newMarker })

                        // 7. Add both vendors to vendorsDisplayedGroup Redux
                        const updatedVendorsDisplayedGroupNew = { ...state.regionMap.vendorsDisplayedGroup, [newMarkerID]: [currentDisplayedVendorData, iteratedDisplayedVendorData] }
                        const payloadGroupNew = { vendorsDisplayedGroup: updatedVendorsDisplayedGroupNew }
                        dispatch(setVendorsDisplayedGroup(payloadGroupNew))
                        return
                    }
                }

                // If new coordinates lie within a grouped vendors coordinates
                // If new coordinates is going to a completely new coordinate
                return
            }


            // Step 3
            // If current vendor is new
                // If new coordinates are the same as another single vendor's coordinates
                // If new coordinates lie within a grouped vendors coordinates
                // If new coordinates is going to a completely new coordinate
        }
    }, markerObjectComparisonState(state, currentVendorID))
}
// NEXT STEP CLEAN UP THE CODE, MAKE IT READABLE, FUNCTIONALIZE IT

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
