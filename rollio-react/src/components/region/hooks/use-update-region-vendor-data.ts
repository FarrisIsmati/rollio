// DEPENDENCIES
import socketIOClient from 'socket.io-client';
import { useDispatch  } from 'react-redux';

// ACTIONS
import useGetAppState from '../../common/hooks/use-get-app-state';
import { updateVendor } from '../../../redux/actions/data-actions';

// CONFIG
import { VENDOR_API } from '../../../config';
import { useEffect } from 'react';

// @ts-ignore
const socket = socketIOClient(VENDOR_API);

const useUpdateRegionVendorData = () => {
    const dispatch = useDispatch();

    useEffect(() => {      
      socket.on('TWITTER_DATA', (data: any) => {
          // format vendorsAll then update that 
          if (data.tweet.location) {
            dispatch(updateVendor({ location: data.tweet.location, vendorID: data.vendorID }));
          }
          // Update Region Data
            // If new active Vendor
              // Append to Daily Active Vendors
          // Update All Vendor Data
            // If vendor exists 
              // Update data
            // If vendor is new
              // Append to object
    
          // ------------------------------
          // ^ This should Rerender Map Pins
        })
    }, [])
}

export default useUpdateRegionVendorData;
