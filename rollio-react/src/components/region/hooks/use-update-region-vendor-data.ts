// Hook sets up sockets for a region to handle all real time data changes per region

// DEPENDENCIES
import socketIOClient from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';
import { toNumber } from 'lodash';

// HOOKS
import useGlobalState from '../../common/hooks/use-global-state';

// ACTIONS
import {
    updateVendorsAll,
    addTweetToSelectedVendorTweetHistory,
    updateSelectedVendorLocations,
} from '../../../redux/actions/data-actions';

// CONFIG
import { VENDOR_API } from '../../../config';

// @ts-ignore
const socket = socketIOClient(VENDOR_API);

const useUpdateRegionVendorData = () => {
    const dispatch = useDispatch();

    const [globalState, setGlobalState] = useGlobalState();

    useEffect(() => {
        // Anything that triggers location related CRUD Operations
        socket.on('NEW_LOCATIONS', (data: any) => {
            const { newLocations, allLocations, vendorID, tweet} = data;

            // Update data.vendorsAll field
            dispatch(updateVendorsAll({
                locations: allLocations,
                vendorID,
            }));
            
            // Real time events if the vendor with the new location is the selected vendor
            // 1. Update Selected Vendor Address (Updates the locations)
            dispatch(updateSelectedVendorLocations(allLocations));

            if (newLocations.length) {
                // Set current new location vendor to global state, so when map gets rerender it will know what vendor to move
                newLocations.forEach((location:any) => {
                    const truckNum = toNumber(location.truckNum);
                    setGlobalState({ vendorID, truckNum })
                });
            }

            // Update Twitter Feed (Inserts new tweet if there is one)
            if (tweet) {
                dispatch(addTweetToSelectedVendorTweetHistory({...tweet, vendorID }));
            }
        })

        // When a vendor is created or updated
        socket.on('UPDATED_VENDOR', (vendor: any) => {
            dispatch(updateVendorsAll({...vendor, vendorID: vendor.id}));
        })
    }, [])
}

export default useUpdateRegionVendorData;
