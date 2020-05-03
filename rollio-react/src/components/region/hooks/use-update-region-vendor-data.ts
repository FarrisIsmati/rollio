// DEPENDENCIES
import socketIOClient from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';
import { toNumber } from 'lodash';

// ACTIONS
import {
  updateVendor,
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
          // TODO: why do we sent regionID if we don't use it ?
          const {
              tweet, newLocations, allLocations, vendorID, regionID,
          } = data;
          if (newLocations.length) {
            const payload = {
                locations: allLocations,
                vendorID,
            };
            dispatch(updateVendor(payload));
              newLocations.forEach((location:any) => {
                const truckNum = toNumber(location.truckNum);
                setGlobalState({ vendorID, truckNum })
            });
          }
        })
    }, [])
}

export default useUpdateRegionVendorData;
