// DEPENDENCIES
import {  useState } from 'react';
import { useDispatch } from 'react-redux';

// REDUX
import { updateVendorLocationAccuracyAsync } from '../../../redux/actions/data-actions';

// INTERFACES
import { AccuracyAsyncStatePayload, accuracyAsyncStateEnum } from './interfaces';

const useUpdateVendorLocationAccuracy = (regionID:string, vendorID:string, locations: [any]) => {
    // Setup accuracyAsyncState default obj
    const accuracyAsyncStateDefaultObj:AccuracyAsyncStatePayload = {};
    locations.forEach((location:any) => {
        accuracyAsyncStateDefaultObj[location._id] = accuracyAsyncStateEnum.DEFAULT;
    })

    const [accuracyAsyncState, setAccuracyAsyncState] = useState<any>(accuracyAsyncStateDefaultObj);

    // Effects
    const dispatch = useDispatch();

    const updateVendorLocationAccuracy = (amount:number, locationID:string) => dispatch(updateVendorLocationAccuracyAsync({
        amount,
        locationID,
        regionID,
        vendorID,
        cbError: (err:any) => {
            console.error(`Failed to vote on location accuracy ${err}`);

            setAccuracyAsyncState({
                ...accuracyAsyncState,
                [locationID]: accuracyAsyncStateEnum.FAILED
            })

            // Timeout resets error message to default
            setTimeout(() => {
                setAccuracyAsyncState({
                    ...accuracyAsyncState,
                    [locationID]: accuracyAsyncStateEnum.DEFAULT
                })
            }, 3000); 
        }
    }));

    return {
        accuracyAsyncState,
        updateVendorLocationAccuracy
    }
}

export default useUpdateVendorLocationAccuracy;
