// DEPENDENCIES
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';

// UTILS
import { getRouteIds } from '../../../util/index';

// ACTIONS
import { fetchRegionDataAsync } from '../../../redux/actions/data-actions';

// Hook acts as a component did mount, loads the region if given via props
const useLoadRegion = (props:any) => {
    const dispatch = useDispatch();

    // Gets vendor profile data, if it fails redirects to an error page
    const getRegionDataFromRegionId = () => {
        const regionId = getRouteIds(props).regionId;

        // Call Back function that will reroute incase something goes awry in the fetRegionDataAsync method
        const reRouteCb = () => {
            props.history.replace('/invalid');
        }

        const payload = {
            regionId,
            shouldFetchVendors: true,
            cb: reRouteCb
        }
        dispatch(fetchRegionDataAsync(payload))

    }

    useEffect(() => {
        // On mount get the region data
        getRegionDataFromRegionId();
    }, [])
}

export default useLoadRegion;
