// DEPENDENCIES
import {  useState } from 'react';
import { useDispatch } from 'react-redux';

// REDUX
import { updateVendorLocationAccuracyAsync } from '../../../redux/actions/data-actions';


const useUpdateVendorLocationAccuracy = (regionID:string, vendorID:string) => {
    const [accuracyAsyncState, setAccuracyAsyncState] = useState<any>(); // Needs to be an object/array?

    // Effects
    const dispatch = useDispatch();

    const updateVendorLocationAccuracy = (amount:number, locationID:string) => dispatch(updateVendorLocationAccuracyAsync({
        amount,
        locationID,
        regionID,
        vendorID,
        cbError: (err:any) => {
            console.log('failure is not an option');
        }
    }));

    return { 
        updateVendorLocationAccuracy
    }
}

export default useUpdateVendorLocationAccuracy;
