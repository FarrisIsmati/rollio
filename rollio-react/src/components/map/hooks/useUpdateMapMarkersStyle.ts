// DEPENDENCIES
import { useEffect } from 'react';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

const useUpdateMapMarkersStyle = (props: any) => {
    const {
        singleVendorMarkers,
        groupVendorMarkers
    } = props;
    const state = useGetAppState();

    const currentlySelectedIds = state.regionMap.currentlySelected.map((currentlySelected:any) => currentlySelected.id);

    useEffect(() => {
        // Removes selected class of a previously selected vendor if there's no currently selected ID
        state.regionMap.previouslySelected.forEach((previouslySelected:any) => {
            if (previouslySelected.isSingle && singleVendorMarkers && singleVendorMarkers[previouslySelected.id] && !currentlySelectedIds.includes(previouslySelected.id)) {
                singleVendorMarkers[previouslySelected.id]._element.classList.remove('map__marker_selected');
                singleVendorMarkers[previouslySelected.id]._element.classList.add('map__marker_default');
            } else if (!previouslySelected.isSingle && groupVendorMarkers && groupVendorMarkers[previouslySelected.id] && !currentlySelectedIds.includes(previouslySelected.id)) {
                groupVendorMarkers[previouslySelected.id]._element.classList.remove('map__marker_selected');
                groupVendorMarkers[previouslySelected.id]._element.classList.add('map__marker_default');
            }
        });

        // Adds selected class to a selected vendor if it exists
        state.regionMap.currentlySelected.forEach((currentlySelected:any) => {
            if (currentlySelected.isSingle && singleVendorMarkers && singleVendorMarkers[currentlySelected.id]) {
                singleVendorMarkers[currentlySelected.id]._element.classList.remove('map__marker_default');
                singleVendorMarkers[currentlySelected.id]._element.classList.add('map__marker_selected');
            } else if (!currentlySelected.isSingle && groupVendorMarkers && groupVendorMarkers[currentlySelected.id]) {
                groupVendorMarkers[currentlySelected.id]._element.classList.remove('map__marker_default');
                groupVendorMarkers[currentlySelected.id]._element.classList.add('map__marker_selected');
            }
        });

    })
}


export default useUpdateMapMarkersStyle;
