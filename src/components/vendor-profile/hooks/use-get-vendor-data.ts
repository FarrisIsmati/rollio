// DEPENDENCIES
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';

// ACTIONS
import { fetchVendorDataAsync } from '../../../redux/actions/data-actions';

const useGetVendorData = (props:any) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const { regionId, vendorId, history } = props;
        const reRouteCb = () => {
            history.replace('/invalid');
        }
        const payload = { 
            regionId,
            vendorId,
            cb: reRouteCb
        }
        dispatch(fetchVendorDataAsync(payload))
    }, [])
}

export default useGetVendorData;
