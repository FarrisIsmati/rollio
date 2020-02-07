// DEPENDENCIES
import { useEffect, useRef } from 'react';
import { useDispatch  } from 'react-redux';
import uuid from 'uuid/v1';
import { useSelector  } from 'react-redux';

// HOOKS
import useGlobalState from '../../common/hooks/use-global-state';

// ACTIONS
import { 
    setVendorsDisplayedSingle, 
    setVendorsDisplayedGroup 
} from '../../../redux/actions/map-actions';

// INTERFACES
import { MarkerComparisonObject } from './interfaces';

const useUpdateMapMarkersState = (props: any) => {
    // Way to get data from tweet stream without storing it in Redux
    const [globalState] = useGlobalState();
    const dispatch = useDispatch();
    const state = useSelector((state:any) => state);
    const currentVendorID = globalState.vendorID;

    const {
        map,
        addSingleVendorToMap,
        addGroupedVendorsToMap,
        singleVendorMarkers, 
        setSingleVendorMarkers,
        groupVendorMarkers, 
        setGroupVendorMarkers,
    } = props;

    // Custom use effect which will only run the update marker coordinates code if it's necessary
    // For example if the coordinates of the current & previous iterations are the same it will not run, unless it's another vendor
    useEffectMarkerComparisonObject(() => {
        if (currentVendorID) {
            const currentVendorData = state.data.vendorsAll[currentVendorID]
            const currentVendorCoords = currentVendorData.location.coordinates;

            // --------------------------------------------
            // CASE 1: If current vendor is a single vendor
            // --------------------------------------------
            // @ts-ignore: singleVendorMarkers wont be null
            if (singleVendorMarkers !== null && singleVendorMarkers[currentVendorID]) {
                // If new coordinates are the same as another single vendor's coordinates
                for (const key in singleVendorMarkers) {
                    const iteratedVendorData = state.data.vendorsAll[key]
                    const iteratedVendorMarker = singleVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (key !== currentVendorID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Remove both single vendor markers from map
                        iteratedVendorMarker.remove()
                        singleVendorMarkers[currentVendorID].remove()

                        // 2. Remove both single vendors from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[key]
                        delete updatedSingleVendorMarkers[currentVendorID]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        
                        // 3. Remove both single vendors from vendorsDisplayedSingle Redux
                        // Getting a copy of the redux data before it's removed to use later for the new group
                        const currentDisplayedVendorData = { ...state.regionMap.vendorsDisplayedSingle[currentVendorID] }
                        const iteratedDisplayedVendorData =  { ...state.regionMap.vendorsDisplayedSingle[key] }

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[key]
                        delete updatedVendorsDisplayedSingle[currentVendorID]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))
                        
                        // 4. Add grouped vendor marker to map
                        const newMarker = addGroupedVendorsToMap({vendors:[currentVendorData, iteratedVendorData], firstVendor: currentVendorData, map});

                        // 5. Add grouped vendors to groupVendorMarkers state
                        const newMarkerID = uuid()
                        setGroupVendorMarkers({ ...groupVendorMarkers, [newMarkerID]: newMarker })

                        // 6. Add both vendors to vendorsDisplayedGroup Redux
                        let selectedState = false;
                        let isPopupActiveState = false;

                        if (currentDisplayedVendorData.selected || iteratedDisplayedVendorData.selected) {
                            selectedState = true
                        } else if (currentDisplayedVendorData.isPopupActive || iteratedDisplayedVendorData.isPopupActive) {
                            isPopupActiveState = true;
                        }

                        const updatedVendorsDisplayedGroup = { ...state.regionMap.vendorsDisplayedGroup,
                            [newMarkerID]: { 
                                selected: selectedState, isPopupActive: isPopupActiveState, vendors: [currentDisplayedVendorData, iteratedDisplayedVendorData] 
                            } 
                        }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))
                        
                        return
                    } else if (key === currentVendorID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // Do nothing because it's the same location the vendor is already in
                        return
                    }
                }

                // If new coordinates are within a grouped vendors coordinates
                for (const key in groupVendorMarkers) {
                    const iteratedVendorMarker = groupVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Remove single vendor marker from map
                        singleVendorMarkers[currentVendorID].remove()

                        // 2. Remove single vendor from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[currentVendorID]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        
                        // 3. Remove single vendor from vendorsDisplayedSingle Redux
                        // Getting a copy of the redux data before it's removed to use later for the new group
                        const currentDisplayedVendorData = { ...state.regionMap.vendorsDisplayedSingle[currentVendorID] }
                        const iteratedDisplayedVendorsData =  { ...state.regionMap.vendorsDisplayedGroup[key] }

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[currentVendorID]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))

                        // 4. Increment grouped vendor marker
                        const vendorsCount = iteratedVendorMarker.getElement().innerHTML
                        iteratedVendorMarker.getElement().innerHTML = parseInt(vendorsCount) + 1

                        // 5. Add vendor to vendorsDisplayedGroup Redux
                        let selectedState = false;
                        let isPopupActiveState = false;

                        if (currentDisplayedVendorData.selected || iteratedDisplayedVendorsData.selected) {
                            selectedState = true
                        } else if (currentDisplayedVendorData.isPopupActive || iteratedDisplayedVendorsData.isPopupActive) {
                            isPopupActiveState = true;
                        }

                        const updatedVendorsDisplayedGroup = { 
                            ...state.regionMap.vendorsDisplayedGroup, 
                            [key]: {
                                selected: selectedState, isPopupActive: isPopupActiveState, vendors: [currentDisplayedVendorData, ...iteratedDisplayedVendorsData.vendors]
                            }
                        }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))

                        return
                    }
                }

                // If new coordinates are going to a completely new coordinate
                // @ts-ignore: singleVendorMarkers wont be null
                singleVendorMarkers[currentVendorID]
                    .setLngLat([currentVendorCoords.long, currentVendorCoords.lat]);
                return
            }

            // --------------------------------------------
            // CASE 2: If current vendor is in a group
            // --------------------------------------------
            // Find the current vendor's group
            const isCurrentVendorInGroup = (() => {
                const vendorsDisplayedGroup = state.regionMap.vendorsDisplayedGroup
                for (const id in vendorsDisplayedGroup) {
                    const group = vendorsDisplayedGroup[id].vendors;
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
            
            if (groupVendorMarkers !== null && isCurrentVendorInGroup.continue) {
                const { groupID, index, currentDisplayedVendorData } = isCurrentVendorInGroup;
                // @ts-ignore: Create type for this in future
                const currentVendorMarker = groupVendorMarkers[groupID];
                const currentVendorMarkerCoords = currentVendorMarker.getLngLat();
                let oldGroupExist = true;
                
                // Keeping track of the modified state because redux updates are async and we cannot wait on them
                // Stand in for state.regionMap.vendorsDisplayedSingle
                let updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle };
                // Stand in for state.regionMap.vendorsDisplayedGroup
                let updatedVendorsDisplayedGroup =  { ...state.regionMap.vendorsDisplayedGroup };
                // Stand in for 
                let updatedSingleVendorMarkers = { ...singleVendorMarkers };
                // Stand in for state groupVendor Markers
                const updatedGroupVendorMakers = { ...groupVendorMarkers };

                // If current vendor leaving group makes current group a single vendor
                // @ts-ignore
                if (updatedVendorsDisplayedGroup[groupID].vendors.length === 2) {
                    // @ts-ignore
                    const currentVendorMarkerCoords = groupVendorMarkers[groupID].getLngLat();
                    if (currentVendorMarkerCoords.lng === currentVendorCoords.long && currentVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // Do nothing because it's the same location the vendor is already in
                        return;
                    }

                    // 1. Get data of vendor not to be relocated
                    // @ts-ignore
                    const currentDisplayedVendorGroupData = { ...updatedVendorsDisplayedGroup[groupID].vendors };
                    // @ts-ignore: If index of vendor is 0 then get index of 1 else get index of 0 (toString because 0 always returns false)
                    const vendorStayingData = index.toString() === '0' ? currentDisplayedVendorGroupData[1] : currentDisplayedVendorGroupData[0];

                    // 2. Remove current groupVendorMarker from State
                    // @ts-ignore
                    delete updatedGroupVendorMakers[groupID];
                    setGroupVendorMarkers({ ...updatedGroupVendorMakers });

                    // 2. Move current groupVendorMarker in singleVendorMarker State
                    updatedSingleVendorMarkers = { ...updatedSingleVendorMarkers, [vendorStayingData.vendorId]: currentVendorMarker };
                    setSingleVendorMarkers(updatedSingleVendorMarkers);

                    // 3. Update new singleVendorMarker to not have number showing on marker
                    currentVendorMarker.getElement().innerHTML = '';

                    // 4. Remove current group from vendorsDisplayedGroup Redux
                    // @ts-ignore
                    delete updatedVendorsDisplayedGroup[groupID];

                    const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup };
                    dispatch(setVendorsDisplayedGroup(payloadGroup));

                    // 5. Move other vendor in vendorsDisplayedGroup to vendorsDisplayedSingle Redux
                    updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle, [vendorStayingData.vendorId]: vendorStayingData };
                    const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle };
                    dispatch(setVendorsDisplayedSingle(payload));

                    oldGroupExist = false
                }

                // If new coordinates are the same as another single vendor's coordinates
                for (const key in singleVendorMarkers) {
                    const iteratedVendorData = state.data.vendorsAll[key]
                    const iteratedVendorMarker = singleVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Remove single vendor marker from map
                        iteratedVendorMarker.remove()

                        // 2. Remove single vendor marker from singleVendorMarkers
                        delete updatedSingleVendorMarkers[key]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)

                        // 3. Remove iterated vendor from vendorsDisplayedSingle Redux
                        const iteratedDisplayedVendorData = { ...updatedVendorsDisplayedSingle[key] }
                        
                        delete updatedVendorsDisplayedSingle[key]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))
                        
                        // 4. Remove current vendor from current vendorsDisplayedGroup Redux 
                        if (oldGroupExist) {
                            // @ts-ignore
                            const oldVendorsDisplayedGroup = updatedVendorsDisplayedGroup[groupID]
                            oldVendorsDisplayedGroup.vendors.splice(index,1)

                            // @ts-ignore: Just setting up the object, the redux update happens in step 7
                            updatedVendorsDisplayedGroup = { ...updatedVendorsDisplayedGroup, [groupID]: oldVendorsDisplayedGroup }
                        }

                        // 5. Decrement grouped vendor marker
                        if (oldGroupExist) {
                            const vendorsCount = currentVendorMarker.getElement().innerHTML
                            currentVendorMarker.getElement().innerHTML = parseInt(vendorsCount) - 1
                        }

                        // 7. Add grouped vendor marker to map
                        const newMarker = addGroupedVendorsToMap({vendors:[currentVendorData, iteratedVendorData], firstVendor: currentVendorData, map});

                        // 8. Add grouped vendors to groupVendorMarkers state
                        const newMarkerID = uuid()
                        setGroupVendorMarkers({ ...updatedGroupVendorMakers, [newMarkerID]: newMarker })

                        // 9. Add both vendors to vendorsDisplayedGroup Redux
                        let selectedState = false;
                        let isPopupActiveState = false;

                        if (currentDisplayedVendorData.selected || iteratedDisplayedVendorData.selected) {
                            selectedState = true
                        } else if (currentDisplayedVendorData.isPopupActive || iteratedDisplayedVendorData.isPopupActive) {
                            isPopupActiveState = true;
                        }
                        
                        updatedVendorsDisplayedGroup = {
                            ...updatedVendorsDisplayedGroup, 
                            [newMarkerID]: {
                                selected: selectedState, isPopupActive: isPopupActiveState, vendors: [currentDisplayedVendorData, iteratedDisplayedVendorData] 
                            }
                        }
                        const payloadGroupNew = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroupNew))

                        return
                    } 
                }

                // If new coordinates lie within a grouped vendors coordinates
                for (const key in updatedGroupVendorMakers) {
                    const iteratedVendorMarker = updatedGroupVendorMakers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (key !== groupID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Remove current vendor from current vendorsDisplayedGroup Redux
                        if (oldGroupExist) {
                            // @ts-ignore
                            const oldVendorsDisplayedGroup = updatedVendorsDisplayedGroup[groupID]
                            oldVendorsDisplayedGroup.vendors.splice(index,1)

                            // @ts-ignore: Just setting up the object, the redux update happens in step 2
                            updatedVendorsDisplayedGroup = { ...updatedVendorsDisplayedGroup, [groupID]: oldVendorsDisplayedGroup }
                        }

                        // 2. Add current vendor to new group in Redux
                        let selectedState = false;
                        let isPopupActiveState = false;

                        if (currentDisplayedVendorData.selected || iteratedVendorMarker.selected) {
                            selectedState = true
                        } else if (currentDisplayedVendorData.isPopupActive || iteratedVendorMarker.isPopupActive) {
                            isPopupActiveState = true;
                        }

                        updatedVendorsDisplayedGroup = {
                            ...updatedVendorsDisplayedGroup,
                            [key]: {
                                selected: selectedState, isPopupActive: isPopupActiveState, vendors: [...updatedVendorsDisplayedGroup[key].vendors, currentDisplayedVendorData]
                            }
                        }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))

                        // 3. Decrement count of current vendor's old group marker
                        if (oldGroupExist) {
                            const oldVendorMarkerCount = currentVendorMarker.getElement().innerHTML
                            currentVendorMarker.getElement().innerHTML = parseInt(oldVendorMarkerCount) - 1
                        }

                        // Increment count of current vendors new group marker
                        const newVendorMarkerCount = iteratedVendorMarker.getElement().innerHTML
                        iteratedVendorMarker.getElement().innerHTML = parseInt(newVendorMarkerCount) + 1

                        return
                    } else if (key === groupID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // Do nothing because it's the same location the vendor is already in
                        return
                    }
                }

                // If new coordinates is going to a completely new coordinate
                if (oldGroupExist) {
                    // 1. Remove current vendor from current vendorsDisplayedGroup Redux
                    // @ts-ignore
                    const oldVendorsDisplayedGroup = updatedVendorsDisplayedGroup[groupID]
                    oldVendorsDisplayedGroup.vendors.splice(index,1)

                    // @ts-ignore
                    updatedVendorsDisplayedGroup = { ...updatedVendorsDisplayedGroup, [groupID]: oldVendorsDisplayedGroup }
                    const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                    dispatch(setVendorsDisplayedGroup(payloadGroup))

                    // 2. Decrement count of current vendor's old group marker
                    const oldVendorMarkerCount = currentVendorMarker.getElement().innerHTML
                    currentVendorMarker.getElement().innerHTML = parseInt(oldVendorMarkerCount) - 1
                }

                // 3. Add current vendor to vendorsDisplayedSingle Redux
                updatedVendorsDisplayedSingle = { ...updatedVendorsDisplayedSingle, [currentVendorID]: currentDisplayedVendorData }
                const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                dispatch(setVendorsDisplayedSingle(payload))

                // 4. Create new single vendor marker
                const marker = addSingleVendorToMap(state.data.vendorsAll[currentVendorID], map)

                // 5. Add new single vendor marker to singleVendorMarkers
                updatedSingleVendorMarkers = { ...updatedSingleVendorMarkers, [currentVendorID]: marker }
                setSingleVendorMarkers(updatedSingleVendorMarkers)

                return
            } else { 
                // --------------------------------------------
                // CASE 3: If current vendor is new
                // --------------------------------------------    
                // If new coordinates are the same as another single vendor's coordinates
                const currentDisplayedVendorData = {
                    vendorId: currentVendorID,
                    selected: false
                }
                // If new coordinates are the same as another single vendor's coordinates
                for (const key in singleVendorMarkers) {
                    const iteratedVendorData = state.data.vendorsAll[key]
                    const iteratedVendorMarker = singleVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (key !== currentVendorID && iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Remove iterated single vendor marker from map
                        iteratedVendorMarker.remove()

                        // 2. Remove iterated single vendor from singleVendorMarkers state
                        const updatedSingleVendorMarkers = { ...singleVendorMarkers }
                        delete updatedSingleVendorMarkers[key]
                        setSingleVendorMarkers(updatedSingleVendorMarkers)
                        
                        // 3. Remove iterated single vendor from vendorsDisplayedSingle Redux
                        const iteratedDisplayedVendorData =  { ...state.regionMap.vendorsDisplayedSingle[key] }

                        const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle }
                        delete updatedVendorsDisplayedSingle[key]
                        const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                        dispatch(setVendorsDisplayedSingle(payload))
                        
                        // 4. Add grouped vendor marker to map
                        const newMarker = addGroupedVendorsToMap({vendors:[currentVendorData, iteratedVendorData], firstVendor: currentVendorData, map});

                        // 5. Add grouped vendors to groupVendorMarkers state
                        const newMarkerID = uuid()
                        setGroupVendorMarkers({ ...groupVendorMarkers, [newMarkerID]: newMarker })

                        // 6. Add both vendors to vendorsDisplayedGroup Redux
                        let selectedState = false;
                        let isPopupActiveState = false;

                        if (currentDisplayedVendorData.selected || iteratedVendorMarker.selected) {
                            selectedState = true
                        } else if (iteratedVendorMarker.isPopupActive) {
                            isPopupActiveState = true;
                        }

                        const updatedVendorsDisplayedGroup = { 
                            ...state.regionMap.vendorsDisplayedGroup, 
                            [newMarkerID]: {
                                selected: selectedState, isPopupActive: isPopupActiveState, vendors: [currentDisplayedVendorData, iteratedDisplayedVendorData] 
                            }
                        }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))

                        return
                    }
                }

                // If new coordinates lie within a grouped vendors coordinates
                for (const key in groupVendorMarkers) {
                    const iteratedVendorMarker = groupVendorMarkers[key];
                    const iteratedVendorMarkerCoords = iteratedVendorMarker.getLngLat();
                    if (iteratedVendorMarkerCoords.lng === currentVendorCoords.long && iteratedVendorMarkerCoords.lat === currentVendorCoords.lat) {
                        // 1. Increment grouped vendor marker
                        const vendorsCount = iteratedVendorMarker.getElement().innerHTML
                        iteratedVendorMarker.getElement().innerHTML = parseInt(vendorsCount) + 1

                        // 2. Add vendor to vendorsDisplayedGroup Redux
                        const iteratedDisplayedVendorsData =  { ...state.regionMap.vendorsDisplayedGroup[key] }

                        let selectedState = false;
                        let isPopupActiveState = false;

                        if (currentDisplayedVendorData.selected || iteratedDisplayedVendorsData.selected) {
                            selectedState = true
                        } else if (iteratedDisplayedVendorsData.isPopupActive) {
                            isPopupActiveState = true;
                        }


                        const updatedVendorsDisplayedGroup = { 
                            ...state.regionMap.vendorsDisplayedGroup, 
                            [key]: {
                                selected: selectedState, isPopupActive: isPopupActiveState, vendors: [currentDisplayedVendorData, ...iteratedDisplayedVendorsData.vendors] 
                            }
                        }
                        const payloadGroup = { vendorsDisplayedGroup: updatedVendorsDisplayedGroup }
                        dispatch(setVendorsDisplayedGroup(payloadGroup))

                        return
                    }
                }

                // If new coordinates are going to a completely new coordinate
                // 1. Add current vendor to vendorsDisplayedSingle Redux
                const updatedVendorsDisplayedSingle = { ...state.regionMap.vendorsDisplayedSingle, [currentVendorID]: currentDisplayedVendorData }
                const payload = { vendorsDisplayedSingle: updatedVendorsDisplayedSingle }
                dispatch(setVendorsDisplayedSingle(payload))

                // 4. Create new single vendor marker
                const marker = addSingleVendorToMap(state.data.vendorsAll[currentVendorID], map)

                // 5. Add new single vendor marker to singleVendorMarkers
                const updatedSingleVendorMarkers = { ...singleVendorMarkers, [currentVendorID]: marker }
                setSingleVendorMarkers(updatedSingleVendorMarkers)
                return
            }
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
        coordinates: {lat: 0, long: 0}
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
            prevDeps.current.coordinates.long === deps.coordinates.long) 
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

export default useUpdateMapMarkersState;
