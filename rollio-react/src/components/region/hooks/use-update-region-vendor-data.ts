// DEPENDENCIES
import socketIOClient from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';
import { toNumber } from 'lodash';

// ACTIONS
import {
  updateVendor,
  addTweetToSelectedVendorTweetHistory,
} from '../../../redux/actions/data-actions';

// HOOKS
import useGlobalState from '../../common/hooks/use-global-state';
import useGetAppState from '../../common/hooks/use-get-app-state';

// CONFIG
import { VENDOR_API } from '../../../config';

// @ts-ignore
const socket = socketIOClient(VENDOR_API);

const useUpdateRegionVendorData = () => {
    // Hooks
    const state = useGetAppState();
    const dispatch = useDispatch();

    
    // Set current new location vendor to global state, so when map gets rerender it'll know what vendor to move
    const [globalState, setGlobalState] = useGlobalState();

    useEffect(() => {
        // Anything that triggers location related CRUD Operations
        socket.on('NEW_LOCATIONS', (data: any) => {
            const { newLocations, allLocations, vendorID, tweet} = data;
            
            const payload = {
                locations: allLocations,
                vendorID,
            };
            dispatch(updateVendor(payload));
            newLocations.forEach((location:any) => {
                const truckNum = toNumber(location.truckNum);
                setGlobalState({ vendorID, truckNum })
            });
            
            // The dispatch will only work if the currently selected vendor is the same as the vendor sending the tweet
            dispatch(addTweetToSelectedVendorTweetHistory(tweet));
        })
        // When a vendor is created or updated
        socket.on('UPDATED_VENDOR', (vendor: any) => {
            dispatch(updateVendor({...vendor, vendorID: vendor.id}));
        })
    }, [])
}

export default useUpdateRegionVendorData;
