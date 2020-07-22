// DEPENDENCIES
import { useEffect } from 'react';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';
import { group } from 'console';

const useUpdateMapMarkersStyle = (props: any) => {
    const {
        singleVendorMarkers,
        groupVendorMarkers
    } = props;
    const state = useGetAppState();

    const currentlySelectedIds = state.regionMap.currentlySelected.map((currentlySelected:any) => currentlySelected.id);

    useEffect(() => {
        // Reset Marker CSS before running
        if (singleVendorMarkers) {
            for (const vendor in singleVendorMarkers) {
                const el = singleVendorMarkers[vendor]._element;
                if (el.classList.contains('map__marker_selected')) {
                    el.classList.remove('map__marker_selected');
                    el.classList.add('map__marker_default');
                }
            }
        }

        if (groupVendorMarkers) {
            for (const vendor in groupVendorMarkers) {
                const el = groupVendorMarkers[vendor]._element;
                if (el.classList.contains('map__marker_selected')) {
                    el.classList.remove('map__marker_selected');
                    el.classList.add('map__marker_default');
                }
            }
        }


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
