// DEPENDENCIES
import { useDispatch  } from 'react-redux';

// HOOKS
import useGetAppState from '../../common/hooks/use-get-app-state';

// REDUX
import { updateVendorLocationAccuracyAsync } from '../../../redux/actions/data-actions';


const useUpdateVendorLocationAccuracy = (payload:any) => {
    const { regionID, vendorID, locationID } = payload;
    // Effects
    const state = useGetAppState();
    const dispatch = useDispatch();

    const updateVendorLocationAccuracy = (amount:number) => dispatch(updateVendorLocationAccuracyAsync({
        amount,
        locationID,
        regionID,
        vendorID,
    }));

    return { 
        updateVendorLocationAccuracy
    }
}

export default useUpdateVendorLocationAccuracy;
