// DEPENDENCIES
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// 
const useUpdateMapMarkersStyle = (props: any) => {
    const {         
        singleVendorMarkers, 
        setSingleVendorMarkers,
        addSingleVendorToMap, 
        groupVendorMarkers, 
        setGroupVendorMarkers,
        addGroupedVendorsToMap 
    } = props;
    const state = useGetAppState();

    const currentlySelected = state.regionMap.currentlySelected;
    const previouslySelected = state.regionMap.previouslySelected;

    useEffect(() => {
        // Removes selected class of a previously selected vendor if there's no currently selected ID
        if (previouslySelected.isSingle !== null) {
            if (previouslySelected.isSingle && singleVendorMarkers && singleVendorMarkers[previouslySelected.id] && !currentlySelected.id) {
                singleVendorMarkers[previouslySelected.id]._element.classList.remove('map__marker_selected');
                singleVendorMarkers[previouslySelected.id]._element.classList.add('map__marker_default');
            } else if (!previouslySelected.isSingle && groupVendorMarkers && groupVendorMarkers[previouslySelected.id] && !currentlySelected.id) {
                groupVendorMarkers[previouslySelected.id]._element.classList.remove('map__marker_selected');
                groupVendorMarkers[previouslySelected.id]._element.classList.add('map__marker_default');
            }
        }

        // Adds selected class to a selected vendor if it exists
        if (currentlySelected.isSingle !== null) {
            if (currentlySelected.isSingle && singleVendorMarkers && singleVendorMarkers[currentlySelected.id]) {
                singleVendorMarkers[currentlySelected.id]._element.classList.remove('map__marker_default');
                singleVendorMarkers[currentlySelected.id]._element.classList.add('map__marker_selected');
            } else if (!currentlySelected.isSingle && groupVendorMarkers && groupVendorMarkers[currentlySelected.id]) {
                groupVendorMarkers[currentlySelected.id]._element.classList.remove('map__marker_default');
                groupVendorMarkers[currentlySelected.id]._element.classList.add('map__marker_selected');
            }

        }
    })
}


export default useUpdateMapMarkersStyle;
