// DEPENDENCIES
import socketIOClient from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';

// ACTIONS
import { 
  updateVendor,
  updateDailyActiveVendors
} from '../../../redux/actions/data-actions';

// HOOKS
import useGlobalState from '../../common/hooks/use-global-state';

// CONFIG
import { VENDOR_API } from '../../../config';

// @ts-ignore
const socket = socketIOClient(VENDOR_API);

const useUpdateRegionVendorData = () => {
    const dispatch = useDispatch();

    // find a way to pass updated vendor id down to the map hook
    const [globalState, setGlobalState] = useGlobalState();

    useEffect(() => {      
      socket.on('TWITTER_DATA', (data: any) => {
          // format vendorsAll then update that 
          if (data.tweet.location) {
            const location = data.tweet.location
            location.coordinates = { lat: location.coordinates[0], long: location.coordinates[1] }
            dispatch(updateVendor({ location, vendorID: data.vendorID, isActive: true }));
            dispatch(updateDailyActiveVendors({ vendorID: data.vendorID }))
            setGlobalState({ vendorID: data.vendorID });
          }
        })
    }, [])
}

export default useUpdateRegionVendorData;
