// DEPENDENCIES
import socketIOClient from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch  } from 'react-redux';
import moment from 'moment';

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
          const { tweet, updatedLocations = [], vendorID, regionID } = data;
          if (tweet.location) {
              const { location } = tweet;
            location.coordinates = { lat: location.coordinates[0], long: location.coordinates[1] };
            // TODO: figure out why globalState is not set
            const currentVendorData = globalState.vendorsAll[vendorID];
            const locations = [location, ...currentVendorData.locations.map((existingLocation:any) => {
                const updatedLocation = updatedLocations.find((updatedLocation:any) => updatedLocation._id === existingLocation._id);
                if (updatedLocation) {
                    return {...updatedLocation, coordinates: { lat: updatedLocation.coordinates[0], long: updatedLocation.coordinates[1] } };
                } else {
                    return existingLocation;
                }
            })];
            const payload = {
                ...currentVendorData,
                locations,
                vendorID: `${vendorID}-${location.truckNum}`,
            };
            dispatch(updateVendor(payload));
            // TODO: this is where we need to figure out which location to update!!!
            setGlobalState({ vendorID });
          }
        })
    }, [])
}

export default useUpdateRegionVendorData;
