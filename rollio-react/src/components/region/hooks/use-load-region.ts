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
    const getRegionDataFromRegionName = () => {
        const regionName = getRouteIds(props).regionName;

        // Call Back function that will reroute incase something goes awry in the fetRegionDataAsync method
        const reRouteCb = () => {
            props.history.replace('/invalid');
        }

        const payload = {
            regionName,
            shouldFetchVendors: true,
            cb: reRouteCb
        }
        dispatch(fetchRegionDataAsync(payload))

    }

    useEffect(() => {
        // On mount get the region data
        getRegionDataFromRegionName();
    }, [])
}

export default useLoadRegion;
