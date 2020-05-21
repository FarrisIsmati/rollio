// DEPENDENCIES
import { useDispatch  } from 'react-redux';

// REDUX
import { updateVendorLocationAccuracyAsync } from '../../../redux/actions/data-actions';


const useUpdateVendorLocationAccuracy = (regionID:string, vendorID:string) => {
    // Effects
    const dispatch = useDispatch();

    const updateVendorLocationAccuracy = (amount:number, locationID:string) => dispatch(updateVendorLocationAccuracyAsync({
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
